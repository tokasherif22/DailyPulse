package com.dailypulse.backend.Quote.controller;


import com.dailypulse.backend.Quote.dto.QuoteRequest;
import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.service.QuoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
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
}
