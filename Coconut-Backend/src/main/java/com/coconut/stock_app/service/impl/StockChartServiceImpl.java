package com.coconut.stock_app.service.impl;

import com.coconut.stock_app.dto.stock.StockChartResponse;
import com.coconut.stock_app.entity.cloud.StockChart;
import com.coconut.stock_app.repository.cloud.StockChartRepository;
import com.coconut.stock_app.service.StockChartService;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockChartServiceImpl implements StockChartService {

    private final StockChartRepository stockChartRepository;

    // 고정된 날짜 설정
    private static final LocalDate FIXED_DATE = LocalDate.of(2024, 11, 25);
    private static final LocalTime MARKET_OPEN = LocalTime.of(9, 0);
    private static final LocalTime MARKET_CLOSE = LocalTime.of(15, 30);

    @Override
    public List<StockChartResponse> getStockChartData(String stockCode, String timeInterval) {
        try {
            // 현재 시간을 기준으로 11/25일의 같은 시간대 계산
            LocalTime currentTime = LocalTime.now();
            LocalDateTime simulatedDateTime;

            if (currentTime.isBefore(MARKET_OPEN)) {
                // 장 시작 전이면 전날 장 마감 데이터 보여주기
                simulatedDateTime = LocalDateTime.of(FIXED_DATE, MARKET_CLOSE);
            } else if (currentTime.isAfter(MARKET_CLOSE)) {
                // 장 마감 후면 당일 장 마감 데이터 보여주기
                simulatedDateTime = LocalDateTime.of(FIXED_DATE, MARKET_CLOSE);
            } else {
                // 장 중이면 현재 시간에 맞는 데이터 보여주기
                simulatedDateTime = LocalDateTime.of(FIXED_DATE, currentTime);
            }

            // 조회 시작 시간 계산
            LocalDateTime startTime = switch (timeInterval) {
                case "1min" -> simulatedDateTime.minusMinutes(40);
                case "10min" -> simulatedDateTime.minusMinutes(400);
                case "60min" -> simulatedDateTime.minusMinutes(2400);
                default -> throw new IllegalArgumentException("Invalid interval: " + timeInterval);
            };

            List<StockChart> chartData = stockChartRepository.findByStockCodeAndTimeRangeForFixedDate(
                    stockCode,
                    startTime,
                    simulatedDateTime,
                    FIXED_DATE
            );

            return chartData.stream()
                    .map(StockChartResponse::fromEntity)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to get stock chart data for interval: {}", timeInterval, e);
            throw new RuntimeException("Failed to get stock chart data", e);
        }
    }
}