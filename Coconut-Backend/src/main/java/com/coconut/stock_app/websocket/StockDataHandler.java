package com.coconut.stock_app.websocket;

import com.coconut.stock_app.dto.stock.StockChartDTO;

import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockDataHandler {

    private final ObjectMapper objectMapper;
    private final StockPublisher stockPublisher;

    public void handleMessage(String payload) {
        try {
            if (payload.contains("\"tr_id\":\"PINGPONG\"")) {
                handlePingPong();
                return;
            }

            String[] parts = payload.split("\\|");
            if (parts.length < 4) {
                return;
            }

            String[] values = parts[3].split("\\^");

            switch (values[0]) {
                case "0001" -> handleKospiData(values);
                case "1001" -> handleKosdaqData(values);
                default -> handleStockData(values);
            }
        } catch (Exception e) {
            log.error("메시지 처리 실패", e);
        }
    }

    private void handleKospiData(String[] values) {
        StockChartDTO indexData = StockChartDTO.builder()
                .stockCode(values[0])
                .currentPrice(new BigDecimal(values[2]))
                .time(values[1])
                .build();

        stockPublisher.saveStockData(values[0], indexData);
    }

    private void handleKosdaqData(String[] values) {
        StockChartDTO indexData = StockChartDTO.builder()
                .stockCode(values[0])
                .currentPrice(new BigDecimal(values[2]))
                .time(values[1])
                .build();

        stockPublisher.saveStockData(values[0], indexData);
    }

    private void handleStockData(String[] values) {
        StockChartDTO stockData = StockChartDTO.builder()
                .stockCode(values[0])
                .time(values[1])
                .currentPrice(new BigDecimal(values[2]))
                .versusSign(values[3])
                .openPrice(new BigDecimal(values[7]))
                .highPrice(new BigDecimal(values[8]))
                .lowPrice(new BigDecimal(values[9]))
                .contingentVol(new BigDecimal(values[12]))
                .accumulatedVol(new BigDecimal(values[13]))
                .accumulatedAmount(new BigDecimal(values[14]))
                .build();

        stockPublisher.saveStockData(values[0], stockData);
    }

    private void handlePingPong() {
        // PING/PONG 처리 로직
    }
}
