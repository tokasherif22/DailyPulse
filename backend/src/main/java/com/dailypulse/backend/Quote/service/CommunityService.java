package com.dailypulse.backend.Quote.service;

import com.dailypulse.backend.Quote.dto.QuoteResponse;
import com.dailypulse.backend.Quote.repo.QuoteRepo;
import com.dailypulse.backend.spark.repo.SparkRepo;
import com.dailypulse.backend.user.dto.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final QuoteRepo quoteRepo;
    private final SparkRepo sparkRepo;
    private final UserRepo userRepo;
    private final QuoteService quoteService;

    // global feed — paginated
    public List<QuoteResponse> getGlobalFeed(String userEmail, int page, int size) {

        // resolve userId once — not on every quote
        Long userId = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();

        Pageable pageable = PageRequest.of(page, size);
        return quoteRepo.findGlobalFeed(pageable)
                .stream()
                .map(q -> quoteService.mapToResponse(q, userId))
                .collect(Collectors.toList());
    }

    // Hall of Fame — top 5 most sparked quotes today
    public List<QuoteResponse> getHallOfFame(String userEmail) {

        // resolve userId once — not on every quote
        Long userId = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();


        LocalDateTime start = LocalDate.now().atStartOfDay();
        System.out.println("start:"+ start);
        LocalDateTime end   = LocalDate.now().atTime(LocalTime.MAX);
        System.out.println("end"+ end);

        Pageable top5 = PageRequest.of(0, 5);

        return quoteRepo.findTopSparked(top5)
                .stream()
                .map(q -> quoteService.mapToResponse(q, userId))
                .collect(Collectors.toList());
    }
}
