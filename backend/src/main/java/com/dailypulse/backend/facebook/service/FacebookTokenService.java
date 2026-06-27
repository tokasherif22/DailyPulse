package com.dailypulse.backend.facebook.service;

import com.dailypulse.backend.user.dto.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class FacebookTokenService {

    @Value("${facebook.app.id}")
    private String appId;

    @Value("${facebook.app.secret}")
    private String appSecret;

    @Value("${facebook.redirect.uri}")
    private String redirectUri;

    private final WebClient webClient;
    private final UserRepo userRepo;

    public void exchangeCodeForToken(String code, String userEmail) {

        String tokenUrl = "https://graph.facebook.com/v18.0/oauth/access_token"
                + "?client_id=" + appId
                + "&client_secret=" + appSecret
                + "&redirect_uri=" + redirectUri
                + "&code=" + code;

        System.out.println("TOKEN URL: " + tokenUrl);

        // exchange code for short-lived token
        String response = webClient.get()
                .uri(tokenUrl)
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), res ->
                        res.bodyToMono(String.class).flatMap(err -> {
                            System.out.println("FACEBOOK TOKEN ERROR: " + err);
                            return Mono.error(new RuntimeException("Facebook token error: " + err));
                        })
                )
                .bodyToMono(String.class)
                .block();

        System.out.println("TOKEN RESPONSE: " + response);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response);
            String shortToken = json.get("access_token").asText();

            // exchange for long-lived token (60 days)
            String longLivedResponse = webClient.get()
                    .uri("https://graph.facebook.com/v18.0/oauth/access_token"
                            + "?grant_type=fb_exchange_token"
                            + "&client_id=" + appId
                            + "&client_secret=" + appSecret
                            + "&fb_exchange_token=" + shortToken)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), res ->
                            res.bodyToMono(String.class).flatMap(err -> {
                                System.out.println("FACEBOOK TOKEN ERROR: " + err);
                                return Mono.error(new RuntimeException("Facebook token error: " + err));
                            })
                    )
                    .bodyToMono(String.class)
                    .block();

            JsonNode longJson = mapper.readTree(longLivedResponse);
            String longToken = longJson.get("access_token").asText();

            System.out.println("longToken:" + longToken );
            // save token to user
            User user = userRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            user.setFacebookToken(longToken);     // ← add this field to User entity
            user.setFacebookConnected(true);
            userRepo.save(user);

        } catch (Exception e) {
            throw new RuntimeException("Failed to exchange Facebook token: " + e.getMessage());
        }
    }

    public void revokeToken(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFacebookToken(null);
        user.setFacebookConnected(false);
        userRepo.save(user);
    }

    public String getToken(String userEmail) {
        return userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getFacebookToken();
    }
}
