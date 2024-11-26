package com.coconut.stock_app.repository.elasticsearch;

import com.coconut.stock_app.entity.elasticsearch.StockDocument;
import java.util.List;
import java.util.Optional;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface StockSearchRepository extends ElasticsearchRepository<StockDocument, String> {

    // 종목 코드로 정확 검색
    Optional<StockDocument> findByStockCode(String stockCode);

    // 종목 이름으로 부분 검색
    List<StockDocument> findByStockNameContaining(String stockName);

    // 사용자 정의 쿼리: 키워드 기반 검색
    @Query("{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"stockName^2\", \"stockCode\"]}}")
    List<StockDocument> searchByKeyword(String keyword);
}
