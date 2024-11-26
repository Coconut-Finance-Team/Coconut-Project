package com.coconut.stock_app.entity.elasticsearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import org.springframework.data.elasticsearch.annotations.InnerField;
import org.springframework.data.elasticsearch.annotations.MultiField;
import org.springframework.data.elasticsearch.annotations.Setting;

@Document(indexName = "stocks")
@Setting(settingPath = "/elasticsearch/settings.json")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockDocument {

    @Id
    private String stockCode;

    @MultiField(
            mainField = @Field(type = FieldType.Text, analyzer = "custom_korean"),
            otherFields = {
                    @InnerField(suffix = "keyword", type = FieldType.Keyword)
            }
    )
    private String stockName;
}
