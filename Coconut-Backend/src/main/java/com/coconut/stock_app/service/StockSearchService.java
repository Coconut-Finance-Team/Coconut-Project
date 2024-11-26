package com.coconut.stock_app.service;

import com.coconut.stock_app.dto.stock.StockSearchResponse;
import com.coconut.stock_app.entity.cloud.StockChart;
import java.util.List;

public interface StockSearchService {
    void initializeSearchIndex();

    List<StockSearchResponse> searchStocks(String keyword);

    void updateSearchIndex(StockChart chart);
}