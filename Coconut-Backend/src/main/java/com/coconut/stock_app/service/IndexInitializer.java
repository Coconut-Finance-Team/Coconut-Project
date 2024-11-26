package com.coconut.stock_app.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class IndexInitializer {
    private final ElasticsearchClient elasticsearchClient;

    @Value("classpath:elasticsearch/settings.json")
    private Resource settingsResource;

    @Value("classpath:elasticsearch/mappings.json")
    private Resource mappingsResource;

    @PostConstruct
    public void initializeIndex() {
        try {
            log.info("Initializing Elasticsearch index...");

            // JSON 파일을 읽어서 문자열로 변환
            String settingsJson = new String(settingsResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            String mappingsJson = new String(mappingsResource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            // 인덱스가 이미 존재하면 삭제
            if (indexExists("stocks")) {
                log.info("Deleting existing index...");
                elasticsearchClient.indices().delete(d -> d.index("stocks"));
            }

            // 인덱스를 생성하면서 JSON 설정 및 매핑을 적용
            elasticsearchClient.indices().create(c -> c
                    .index("stocks")
                    .withJson(new ByteArrayInputStream(settingsJson.getBytes(StandardCharsets.UTF_8)))
                    .withJson(new ByteArrayInputStream(mappingsJson.getBytes(StandardCharsets.UTF_8)))
            );

            log.info("Index initialization completed.");
        } catch (Exception e) {
            log.error("Failed to initialize Elasticsearch index", e);
        }
    }

    private boolean indexExists(String indexName) throws IOException {
        return elasticsearchClient.indices().exists(e -> e.index(indexName)).value();
    }
}
