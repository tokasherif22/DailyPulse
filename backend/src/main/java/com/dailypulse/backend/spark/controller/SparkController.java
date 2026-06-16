package com.dailypulse.backend.spark.controller;


import com.dailypulse.backend.spark.model.SparkResponse;
import com.dailypulse.backend.spark.service.SparkService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sparks")
@RequiredArgsConstructor
public class SparkController {

    private final SparkService sparkService;

    @PostMapping("/{quoteId}/toggle")
    public ResponseEntity<SparkResponse> toggle(
            @PathVariable Long quoteId,
            Authentication auth) {
        return ResponseEntity.ok(
                sparkService.toggleSpark(quoteId, auth.getName())
        );
    }

    @GetMapping("/{quoteId}")
    public ResponseEntity<SparkResponse> getInfo(
            @PathVariable Long quoteId,
            Authentication auth) {
        return ResponseEntity.ok(
                sparkService.getSparkInfo(quoteId, auth.getName())
        );
    }
}