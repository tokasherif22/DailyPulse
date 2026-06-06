package com.dailypulse.backend.AI;

import com.dailypulse.backend.Quote.model.Topic;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public AiResponse generateQuote(Topic topic) {
//        to test if model can generateContent use url:https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

//        Map<String, Object> requestBody = Map.of(
//                "contents", List.of(
//                        Map.of("parts", List.of(
//                                Map.of("text", buildPrompt(topic.toString()))
//                        ))
//                )
//        );

        // build request using typed classes — not Map.of()
        GeminiRequest requestBody = new GeminiRequest(
                List.of(new GeminiRequest.Content(
                        List.of(new GeminiRequest.Part(buildPrompt(topic.toString())))
                ))
        );

        System.out.println("requestBody: " + requestBody);

        String raw = webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.value() == 429, response ->
                        Mono.error(new RuntimeException("AI service is busy, please try again in a moment."))
                )
                .onStatus(status -> status.is4xxClientError(), response ->
                        response.bodyToMono(String.class).flatMap(errorBody -> {
                            System.out.println("GEMINI ERROR: " + errorBody);
                            return Mono.error(new RuntimeException(errorBody));
                        })
                )
                .bodyToMono(String.class)
                .block();
        System.out.println("raw: "+ raw);

        // parse the JSON response from the LLM
        return parseResponse(raw);
    }

    private String buildPrompt(String topic) {
        return String.format(
                "Generate an inspiring quote about '%s'. " +
                        "Return ONLY a JSON object, no extra text, no markdown, no backticks: " +
                        "{\"generatedText\": \"your quote here\"}",
                topic
        );
    }

    private AiResponse parseResponse(String raw) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(raw);
            String content = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text").asText();

            // clean in case Gemini wraps in markdown backticks anyway
            content = content
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            JsonNode parsed = mapper.readTree(content);
            return new AiResponse(
                    parsed.path("generatedText").asText()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response");
        }
    }
}
