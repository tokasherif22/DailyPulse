package com.dailypulse.backend.Quote.controller;

import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.service.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping("/feed")
    public ResponseEntity<List<QuoteResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication auth) {
        return ResponseEntity.ok(
                communityService.getGlobalFeed(auth.getName(), page, size)
        );
    }

    @GetMapping("/hall-of-fame")
    public ResponseEntity<List<QuoteResponse>> getHallOfFame(Authentication auth) {
        return ResponseEntity.ok(
                communityService.getHallOfFame(auth.getName())
        );
    }
}