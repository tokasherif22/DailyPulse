package com.dailypulse.backend.facebook.controller;

import com.dailypulse.backend.AI.AiService;
import com.dailypulse.backend.facebook.model.FacebookPublishRequest;
import com.dailypulse.backend.facebook.service.FacebookPublishService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/facebook")
@RequiredArgsConstructor
public class FacebookPublishController {

    private final FacebookPublishService publishService;
    private final AiService aiService;

    @PostMapping("/caption")
    public ResponseEntity<Map<String, String>> generateCaption(
            @RequestBody Map<String, String> request) {

        String caption = aiService.generateFacebookCaption(
                request.get("text"),
                request.get("topic")
        );
        return ResponseEntity.ok(Map.of("caption", caption));
    }

    @PostMapping("/publish")
    public ResponseEntity<Void> publish(
            @RequestBody FacebookPublishRequest request,
            Authentication auth) {
        publishService.publishToFacebook(request, auth.getName());
        return ResponseEntity.ok().build();
    }
}
