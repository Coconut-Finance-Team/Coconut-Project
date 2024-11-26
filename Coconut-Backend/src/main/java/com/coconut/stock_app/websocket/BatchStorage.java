package com.coconut.stock_app.websocket;

import com.coconut.stock_app.entity.cloud.StockChart;
import com.coconut.stock_app.repository.cloud.StockChartRepository;
import com.coconut.stock_app.service.StockSearchService;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@RequiredArgsConstructor
@Component
public class BatchStorage {

    private final StockChartRepository stockChartRepository;
    private final StockSearchService stockSearchService;
    private final ConcurrentMap<String, List<StockChart>> stockDataMap = new ConcurrentHashMap<>();

    public void addStockData(String stockCode, StockChart data) {
        stockDataMap.computeIfAbsent(stockCode, k -> new ArrayList<>()).add(data);
    }

    public ConcurrentMap<String, List<StockChart>> getAllStockData() {
        return stockDataMap;
    }

    public void clearStockData(String stockCode) {
        stockDataMap.remove(stockCode);
    }

    @Scheduled(fixedRate = 60000) // 1분마다 실행
    public void saveBatchToDatabase() {
        try {
            // BatchStorage의 모든 데이터 가져오기
            ConcurrentMap<String, List<StockChart>> stockDataMap = getAllStockData();

            for (String stockCode : stockDataMap.keySet()) {
                List<StockChart> stockCharts = stockDataMap.get(stockCode);

                if (stockCharts != null && !stockCharts.isEmpty()) {
                    // 1. MySQL 저장
                    List<StockChart> savedCharts = stockChartRepository.saveAll(new ArrayList<>(stockCharts));

                    // 2. 최신 데이터로 ElasticSearch 업데이트
                    StockChart latestChart = savedCharts.stream()
                            .max(Comparator.comparing(StockChart::getTime))
                            .orElseThrow();

                    stockSearchService.updateSearchIndex(latestChart);

                    // 3. 배치 데이터 클리어
                    clearStockData(stockCode);
                }
            }
        } catch (Exception e) {
            log.error("Batch 저장 중 오류 발생", e);
        }
    }
}
