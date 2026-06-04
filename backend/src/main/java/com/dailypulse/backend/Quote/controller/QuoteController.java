package com.dailypulse.backend.Quote.controller;


import com.dailypulse.backend.Quote.dto.QuoteRequest;
import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/quote")
@RequiredArgsConstructor
public class QuoteController {

    @Autowired
    QuoteService quoteService;

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
    public QuoteResponse generateAIQuote(@RequestBody QuoteRequest request){
        return quoteService.generateAIQuote(request.getTopic());
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
