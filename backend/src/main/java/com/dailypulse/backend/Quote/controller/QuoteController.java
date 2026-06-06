package com.dailypulse.backend.Quote.controller;


import com.dailypulse.backend.AI.AiResponse;
import com.dailypulse.backend.AI.AiService;
import com.dailypulse.backend.Quote.dto.QuoteRequest;
import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quote")
@RequiredArgsConstructor
public class QuoteController {

    @Autowired
    QuoteService quoteService;

    @Autowired
    AiService aiService;

    @GetMapping("/getAllQuotes")
    public List<QuoteResponse> getAllQuotes () {
     List<QuoteResponse> quoteResponses = quoteService.getAll();
     return quoteResponses;
    }

    @GetMapping("/getAllQuotesToday")
    public List<QuoteResponse> getAllQuotesToday () {
        return quoteService.getAllTodayQuotes();
    }

    @GetMapping("/getAllMyQuotes")
    public List<QuoteResponse> getAllMyQuotes (Authentication auth) {
        return quoteService.getAllMyQuotes(auth.getName());
    }

    @PostMapping("/createQuote")
    public QuoteResponse createQuote (@RequestBody QuoteRequest request,
                             Authentication auth){
        return quoteService.createQuote (
                request,
                auth.getName()
        );

    }

    @PostMapping("/generateAIQuote")
    public ResponseEntity<?> generateAIQuote(@RequestBody QuoteRequest request){
        try {
            System.out.println("topic:" + request.getTopic());
            AiResponse response = aiService.generateQuote(request.getTopic());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<QuoteResponse> publish(@PathVariable Long id, Authentication auth) {
        QuoteResponse response = quoteService.publish(id, auth.getName());
        return ResponseEntity.ok(response);
    }

//    @PostMapping("/resonateQuote")
//    public QuoteResponse resonateQuote(@RequestBody QuoteRequest request){
//        return quoteService.resonateQuote(request.getTopic(),request.getText());
//    }
//
//    @PostMapping("/{id}/scheduleQuote")
//    public QuoteResponse scheduleQuote (@RequestParam Integer id , @RequestBody QuoteRequest request){
//        return null;
//    }
//

}
