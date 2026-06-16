package com.dailypulse.backend.Quote.service;

import com.dailypulse.backend.Quote.dto.QuoteRequest;
import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.model.Quote;
import com.dailypulse.backend.Quote.model.Status;
import com.dailypulse.backend.Quote.model.Topic;
import com.dailypulse.backend.Quote.repo.QuoteRepo;
import com.dailypulse.backend.schedular.QuoteSchedulerService;
import com.dailypulse.backend.spark.model.Spark;
import com.dailypulse.backend.spark.repo.SparkRepo;
import com.dailypulse.backend.spark.service.SparkService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuoteService {

    @Autowired
    QuoteRepo quoteRepo;

    @Autowired
    QuoteSchedulerService quoteSchedulerService;

    @Autowired
    private final ModelMapper modelMapper;

    @Autowired
    SparkRepo sparkRepo;

//    public List<QuoteResponse> getAll() {
//
//        return quoteRepo
//                .findAll()
//                .stream()
//                .map(q -> new QuoteResponse(
//                        q.getId(),
//                        q.getText(),
//                        q.getCreatedBy(),
//                        q.getCreatedAt(),
//                        q.getTopic(),
//                        q.getStatus(),
//                        q.getIsAIGenerated(),
//                        0,
//                        false
//                ))
//                .toList();
//    }

    public List<QuoteResponse> getAllMyQuotes(String createdBy) {

        List<Quote> quotes = quoteRepo.findByCreatedBy(createdBy);

        System.out.println("quotes: " + quotes);

        return quotes.stream()
                .map(quote -> modelMapper.map(quote, QuoteResponse.class))
                .collect(Collectors.toList());
    }

    public List<QuoteResponse> getAllTodayQuotes() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();         // 2025-06-02 00:00:00
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);    // 2025-06-02 23:59:59

        List<Quote> quotes = quoteRepo.findByCreatedAtBetween(startOfDay, endOfDay);

        return quotes.stream()
                .map(quote -> modelMapper.map(quote, QuoteResponse.class))
                .collect(Collectors.toList());
    }

    public QuoteResponse generateAIQuote(Topic topic){
        return null;
    }

    public QuoteResponse resonateQuote(Topic topic,String text){
        return null;
    }

//    get status draft or published from frontend
    public QuoteResponse createQuote (
            QuoteRequest request,
            String creator
    ) {

        Quote quote =
                Quote.builder()
                        .text(request.getText())
                        .createdBy(creator)
                        .createdAt(LocalDateTime.now())
                        .topic(request.getTopic())
                        .status(request.getStatus())
                        .isAIGenerated(request.getIsAIGenerated())
                        .scheduledAt(request.getScheduledAt())
                        .build();
//set other time for testing
//        request.setScheduledAt(
//                LocalDateTime.of(
//                        2026,
//                        6,
//                        10,
//                        11,
//                        40
//                )
//        );
        quoteRepo.save(quote);

        // if scheduled — register the Quartz job
        if (request.getScheduledAt() != null) {
            try {
                quoteSchedulerService.scheduleQuotePublishing(
                        quote.getId(),
                        request.getScheduledAt()
                );
            } catch (SchedulerException e) {
                throw new RuntimeException("Failed to schedule quote: " + e.getMessage());
            }
        }

//        return mapToResponse()

        return new QuoteResponse(
                quote.getId(),
                quote.getText(),
                quote.getCreatedBy(),
                quote.getCreatedAt(),
                quote.getTopic(),
                quote.getStatus(),
                quote.getIsAIGenerated(),
                0,
                false
        );
    }

    public QuoteResponse mapToResponse(Quote quote, Long UserId) {
        QuoteResponse response = modelMapper.map(quote, QuoteResponse.class);
        response.setSparkCount(sparkRepo.countByQuoteId(quote.getId()));
        response.setSparked(sparkRepo.existsByQuoteIdAndUserId(
                quote.getId(), UserId
        ));
        return response;
    }

    public QuoteResponse publish (Long id , String email){
        Quote quote = quoteRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Quote not found"));

        // optional: make sure the user owns this quote
        if (!quote.getCreatedBy().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        quote.setStatus(Status.PUBLISHED);
        quoteRepo.save(quote);
        return modelMapper.map(quote, QuoteResponse.class);
    }



}
