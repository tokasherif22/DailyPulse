package com.dailypulse.backend.spark.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SparkResponse {
    private Long quoteId;
    private boolean sparked;    // did the current user spark this?
    private long sparkCount;    // total sparks on this quote
}
