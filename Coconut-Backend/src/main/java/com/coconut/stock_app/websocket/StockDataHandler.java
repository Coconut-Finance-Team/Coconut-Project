package com.coconut.stock_app.websocket;

import com.coconut.stock_app.dto.stock.StockChartDTO;

import com.coconut.stock_app.entity.cloud.StockChart;
import com.coconut.stock_app.repository.cloud.StockChartRepository;
import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockDataHandler {
    private final StockChartRepository stockChartRepository;
    private final StockPublisher stockPublisher;
    private static final LocalDate FIXED_DATE = LocalDate.of(2024, 11, 25);
    private final ConcurrentMap<String, Integer> currentIndexMap = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, List<StockChart>> stockDataCache = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    //@PostConstruct
    public void init() {
        // 초기 데이터 로드
        loadFixedDateData("0001"); // KOSPI
        loadFixedDateData("1001"); // KOSDAQ

        // 실시간 데이터 시뮬레이션 시작
        startSimulation("0001");
        startSimulation("1001");
    }

    private void loadFixedDateData(String stockCode) {
        try {
            List<StockChart> dailyData = stockChartRepository.findByStockCodeAndDate(
                    stockCode,
                    FIXED_DATE.atStartOfDay(),
                    FIXED_DATE.atTime(23, 59, 59)
            );
            stockDataCache.put(stockCode, dailyData);
            currentIndexMap.put(stockCode, 0);
            log.info("Loaded {} data points for stock {}", dailyData.size(), stockCode);
        } catch (Exception e) {
            log.error("Failed to load fixed date data for stock {}", stockCode, e);
        }
    }

    private void startSimulation(String stockCode) {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                List<StockChart> data = stockDataCache.get(stockCode);
                if (data == null || data.isEmpty()) return;

                int currentIndex = currentIndexMap.get(stockCode);
                if (currentIndex >= data.size()) {
                    currentIndex = 0;
                }

                StockChart currentData = data.get(currentIndex);
                StockChartDTO dto = StockChartDTO.builder()
                        .stockCode(stockCode)
                        .currentPrice(currentData.getCurrentPrice())
                        .time(currentData.getTime().format(DateTimeFormatter.ofPattern("HHmmss")))
                        .accumulatedAmount(currentData.getAccumulatedAmount())
                        .accumulatedVol(currentData.getAccumulatedVol())
                        .contingentVol(currentData.getContingentVol())
                        .build();

                stockPublisher.saveStockData(stockCode, dto);
                currentIndexMap.put(stockCode, currentIndex + 1);
            } catch (Exception e) {
                log.error("Error in simulation for stock {}", stockCode, e);
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    // 기존 handleMessage 메소드는 제거하거나 무시
    public void handleMessage(String payload) {
        // WebSocket에서 오는 실제 데이터는 무시
    }
}