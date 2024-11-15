package com.coconut.stock_app.websocket;

import com.coconut.stock_app.entity.cloud.Stock;
import com.coconut.stock_app.entity.cloud.StockChart;
import com.coconut.stock_app.repository.cloud.StockChartRepository;
import com.coconut.stock_app.repository.cloud.StockRepository;
import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.coconut.stock_app.dto.stock.StockChartDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.CompletableFuture;
import org.json.JSONObject;
import org.springframework.data.redis.connection.DataType;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;
import com.coconut.stock_app.dto.stock.StockIndexDto;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KISWebSocketClient {

    private final RedisTemplate<String, String> redisTemplate;
    private final KISApiService kisApiService;

    private final ObjectMapper objectMapper;

    private final StockRepository stockRepository;
    private final StockChartRepository stockChartRepository;

    private WebSocketSession session;
    private volatile boolean isSubscribedKOSPI = false; // 동기화를 위한 volatile
    private volatile boolean isSubscribedKOSDAQ = false;

    @PostConstruct
    public void initializeWebSocketConnection() {
        CompletableFuture.runAsync(() -> {
            try {
                System.out.println("[StockWebSocketService] Initializing WebSocket connection...");
                connectToWebSocket();
                System.out.println("[StockWebSocketService] WebSocket 연결 작업 완료.");
            } catch (Exception e) {
                System.err.println("[StockWebSocketService] WebSocket 초기화 중 오류 발생: " + e.getMessage());
                e.printStackTrace();
            }
        });
    }

    public void connectToWebSocket() {
        WebSocketClient client = new StandardWebSocketClient();

        try {
            String wsUrl = "ws://ops.koreainvestment.com:21000";

            client.execute(new AbstractWebSocketHandler() {
                @Override
                public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                    KISWebSocketClient.this.session = session;
                    System.out.println("WebSocket 연결 성공");

                    // approval_key 갱신 및 초기 핸드셰이크 전송
                    sendHandshakeMessage();
                }

                @Override
                public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
                    String payload = message.getPayload();
                    System.out.println("Raw WebSocket Response: " + payload);

                    if (payload.contains("\"tr_id\":\"PINGPONG\"")) {
                        handlePingPongMessage();
                        return;
                    }

                    if (payload.contains("\"msg1\":\"SUBSCRIBE SUCCESS\"")) {
                        handleSubscribeSuccess(payload);
                        return;
                    }

                    handleReceivedMessage(payload);
                }

                @Override
                public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
                    System.err.println("[StockWebSocketService] WebSocket 오류 발생: " + exception.getMessage());
                    reconnectWithBackoff();
                }

                @Override
                public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
                    System.out.println("[StockWebSocketService] WebSocket 연결 종료: " + status);
                    reconnectWithBackoff();
                }
            }, wsUrl);

        } catch (Exception e) {
            System.err.println("[StockWebSocketService] WebSocket 연결 실패: " + e.getMessage());
            reconnectWithBackoff();
        }
    }

    private synchronized void sendHandshakeMessage() throws IOException {
        kisApiService.invalidateApprovalKey();
        String approvalKey = kisApiService.getApprovalKey();

        List<List<String>> list = Arrays.asList(
                Arrays.asList("H0UPCNT0", "0001"),
                Arrays.asList("H0UPCNT0", "0002"),
                Arrays.asList("H0STCNT0", "005930")
        );

        for (List<String> row : list) {
            JSONObject request = new JSONObject();

            JSONObject header = new JSONObject();
            header.put("approval_key", approvalKey);
            header.put("custtype", "P");
            header.put("tr_type", "1");
            header.put("content-type", "utf-8");

            JSONObject body = new JSONObject();
            JSONObject input = new JSONObject();
            input.put("tr_id", row.get(0));
            input.put("tr_key", row.get(1));
            body.put("input", input);

            request.put("header", header);
            request.put("body", body);

            session.sendMessage(new TextMessage(request.toString()));
            System.out.println("구독 요청 전송: " + request.toString());
        }
    }

    private synchronized void handlePingPongMessage() {
        try {
            if (!isSubscribedKOSPI) {
                sendSubscribeMessage("0001");
                isSubscribedKOSPI = true;
            }
            if (!isSubscribedKOSDAQ) {
                sendSubscribeMessage("0002");
                isSubscribedKOSDAQ = true;
            }
            session.sendMessage(new TextMessage("{\"tr_id\":\"PONG\"}"));
            System.out.println("[StockWebSocketService] PONG 메시지 전송 완료");
        } catch (Exception e) {
            System.err.println("[StockWebSocketService] PINGPONG 처리 중 오류: " + e.getMessage());
        }
    }

    private void handleSubscribeSuccess(String payload) {
        if (payload.contains("\"tr_key\":\"0001\"")) {
            isSubscribedKOSPI = true;
            System.out.println("[DEBUG] KOSPI 구독 성공");
        } else if (payload.contains("\"tr_key\":\"0002\"")) {
            isSubscribedKOSDAQ = true;
            System.out.println("[DEBUG] KOSDAQ 구독 성공");
        }
    }

    private void sendSubscribeMessage(String trKey) throws IOException {
        String approvalKey = kisApiService.getApprovalKey();

        if (session == null || !session.isOpen()) {
            System.err.println("[StockWebSocketService] WebSocket 세션이 열려있지 않습니다. 구독 요청 실패");
            kisApiService.invalidateApprovalKey();
            return;
        }

        String subscribeMessage = String.format(
                "{\"header\": {\"approval_key\": \"%s\", \"custtype\": \"P\", \"tr_type\": \"1\", \"content-type\": \"utf-8\"}, \"body\": {\"input\": {\"tr_id\": \"H0UPCNT0\", \"tr_key\": \"%s\"}}}",
                approvalKey, trKey);

        session.sendMessage(new TextMessage(subscribeMessage));
        System.out.println("[StockWebSocketService] 구독 요청 전송: tr_key=" + trKey);
    }

    private void handleReceivedMessage(String payload) {
        try {
            String[] parts = payload.split("\\|");
            if (parts.length < 4) {
                System.err.println("[StockWebSocketService] 수신 데이터가 잘못되었습니다: " + payload);
                return;
            }

            String data = parts[3];
            String[] values = data.split("\\^");

            if ("0001".equals(values[0])) {
                processIndexData("kospi", "KOSPI", values);
            } else if ("0002".equals(values[0])) {
                processIndexData("kosdaq", "KOSDAQ", values);
            } else {
                processStockData("stock-" + values[0], values);
            }
        } catch (Exception e) {
            System.err.println("[StockWebSocketService] 수신 메시지 처리 중 오류: " + e.getMessage());
        }
    }

    private void processStockData(String redisKey, String[] values) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HHmmss");
            LocalTime time = LocalTime.parse(values[1], formatter);

            StockChartDTO stockChartDTO = StockChartDTO.builder()
                    .stockCode(values[0])
                    .currentPrice(new BigDecimal(values[2]))
                    .versusSign(values[3])
                    .openPrice(new BigDecimal(values[7]))
                    .highPrice(new BigDecimal(values[8]))
                    .lowPrice(new BigDecimal(values[9]))
                    .contingentVol(new BigDecimal(values[12]))
                    .accumulatedVol(new BigDecimal(values[13]))
                    .accumulatedAmount(new BigDecimal(values[14]))
                    .build();

            String json = objectMapper.writeValueAsString(stockChartDTO);

            System.out.println("stock");
            // Redis 키가 존재하지 않거나 타입이 List가 아닐 경우 초기화
            DataType type = redisTemplate.type(redisKey);
            if (type == DataType.NONE) {
                System.out.println("[StockWebSocketService] 키가 없으므로 새로운 List 생성: " + redisKey);
            } else if (type != DataType.LIST) {
                System.out.println("[StockWebSocketService] 잘못된 타입 발견, 키 삭제 후 재생성: " + redisKey);
                redisTemplate.delete(redisKey);
            }

            // 데이터 저장
            redisTemplate.opsForList().leftPush(redisKey, json);
        }  catch (JsonProcessingException e) {
            System.err.println("Redis 직렬화 오류: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Redis 저장 오류: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void processIndexData(String redisKey, String marketName, String[] values) {
        try {
            StockIndexDto stockData = new StockIndexDto(
                    values[0], // marketCode
                    values[1], // marketTime
                    values[2] // currentIndex
            );
            String json = objectMapper.writeValueAsString(stockData);
            redisTemplate.opsForList().leftPush(redisKey, json);
            System.out.println("데이터 저장: " + stockData);
        } catch (Exception e) {
            System.err.println("데이터 처리 오류: " + e.getMessage());
        }
    }

    private void reconnectWithBackoff() {
        int backoff = 1000;
        for (int i = 0; i < 5; i++) {
            try {
                Thread.sleep(backoff);
                connectToWebSocket();
                return;
            } catch (InterruptedException e) {
                System.err.println("재연결 대기 중 오류: " + e.getMessage());
            }
            backoff *= 2;
        }
        System.err.println("WebSocket 재연결 실패: 최대 시도 초과");
    }

    public void saveStockDataToMySQL() {
        List<StockChart> stockCharts = new ArrayList<>();
        // 모든 키 가져오기
        for (String key : redisTemplate.keys("stock-*")) {
            // 키에서 StockCode 추출
            String stockCode = key.substring(6);

            // 주식 코드로 Stock 엔티티 조회
            Stock stock = stockRepository.findByStockCode(stockCode);
            if (stock == null) {
                System.err.println("해당 StockCode를 찾을 수 없습니다: " + stockCode);
                continue;
            }

            // Redis 키 타입 확인
            DataType type = redisTemplate.type(key);
            if (type != DataType.LIST) {
                System.out.println("잘못된 키 타입 발견: " + key + ", 타입: " + type);
                redisTemplate.delete(key); // 잘못된 타입의 키 삭제
                continue;
            }
            // Redis에서 데이터 가져오기
            List<String> stockDataList = redisTemplate.opsForList().range(key, 0, -1);
            if (stockDataList != null) {
                for (String jsonData : stockDataList) {
                    try {
                        StockChartDTO dto = objectMapper.readValue(jsonData, StockChartDTO.class);
                        StockChart stockChart = dto.toEntity(stock);
                        stockCharts.add(stockChart);
                    } catch (JsonProcessingException e) {
                        System.err.println("JSON 변환 오류: " + e.getMessage());
                    }
                }
                // Redis에서 해당 키 삭제
                redisTemplate.delete(key);
            }
        }

        // MySQL에 배치 저장
        if (!stockCharts.isEmpty()) {
            stockChartRepository.saveAll(stockCharts);
            System.out.println("MySQL에 저장된 주식 데이터 수: " + stockCharts.size());
        } else {
            System.out.println("저장할 데이터가 없습니다.");
        }
    }
}
