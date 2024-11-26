package com.coconut.stock_app.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.coconut.stock_app.dto.stock.StockSearchResponse;
import com.coconut.stock_app.entity.cloud.StockChart;
import com.coconut.stock_app.entity.elasticsearch.StockDocument;
import com.coconut.stock_app.repository.cloud.StockChartRepository;
import com.coconut.stock_app.repository.elasticsearch.StockSearchRepository;
import com.coconut.stock_app.service.StockSearchService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockSearchServiceImpl implements StockSearchService {

    private final StockSearchRepository searchRepository;
    private final StockChartRepository stockChartRepository;
    private final ElasticsearchClient elasticsearchClient;

    @PostConstruct
    @Override
    public void initializeSearchIndex() {
        try {
            log.info("Initializing search index...");

            List<StockChart> latestCharts = stockChartRepository.findLatestChartForEachStock();
            if (latestCharts.isEmpty()) {
                log.warn("No stock data found for indexing");
                return;
            }

            List<StockDocument> documents = latestCharts.stream()
                    .map(chart -> StockDocument.builder()
                            .stockCode(chart.getStock().getStockCode())
                            .stockName(chart.getStock().getStockName())
                            .build())
                    .collect(Collectors.toList());

            searchRepository.saveAll(documents);
            log.info("Successfully indexed {} stocks", documents.size());
        } catch (Exception e) {
            log.error("Failed to initialize search index", e);
            throw new RuntimeException("Search index initialization failed", e);
        }
    }

    @Override
    public List<StockSearchResponse> searchStocks(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {
            // 사용자 정의 쿼리를 통한 검색
            List<StockDocument> results = searchRepository.searchByStockCode(keyword);
            return results.stream().map(StockSearchResponse::fromDocument).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Failed to search stocks with keyword: {}", keyword, e);
            return Collections.emptyList();
        }
    }

    @Override
    public void updateSearchIndex(StockChart chart) {
        try {
            StockDocument document = StockDocument.builder().stockCode(chart.getStock().getStockCode())
                    .stockName(chart.getStock().getStockName()).build();

            searchRepository.save(document);
            log.debug("Updated search index for stock: {}", chart.getStock().getStockCode());
        } catch (Exception e) {
            log.error("Failed to update search index for stock: {}", chart.getStock().getStockCode(), e);
        }
    }
}
