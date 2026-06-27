package com.dailypulse.backend.facebook.service;

import com.dailypulse.backend.Quote.repo.QuoteRepo;
import com.dailypulse.backend.facebook.model.FacebookPublishRequest;
import com.dailypulse.backend.user.dto.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class FacebookPublishService {

    private final WebClient webClient;
    private final FacebookTokenService tokenService;
    private final QuoteRepo quoteRepo;

    @Autowired
    UserRepo userRepo;

    public void publishToFacebook(FacebookPublishRequest request, String userEmail) {

        String token = tokenService.getToken(userEmail);
        if (token == null) {
            throw new RuntimeException("Facebook account not connected.");
        }

        // build the message
        String message = request.getPostText() + "\n\n" + request.getCaption();

        // post to Facebook
        Map<String, String> body = Map.of(
                "message", message,
                "access_token", token
        );

        String response = webClient.post()
                .uri("https://graph.facebook.com/v25.0/me/feed")
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), res ->
                        res.bodyToMono(String.class).flatMap(err ->
                                Mono.error(new RuntimeException("Facebook API error: " + err))
                        )
                )
                .bodyToMono(String.class)
                .block();

        System.out.println("Facebook post published: " + response);
    }
}
