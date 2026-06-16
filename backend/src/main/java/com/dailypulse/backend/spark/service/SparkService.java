package com.dailypulse.backend.spark.service;

import com.dailypulse.backend.Quote.model.Quote;
import com.dailypulse.backend.Quote.repo.QuoteRepo;
import com.dailypulse.backend.spark.model.Spark;
import com.dailypulse.backend.spark.model.SparkResponse;
import com.dailypulse.backend.spark.repo.SparkRepo;
import com.dailypulse.backend.user.dto.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    public class SparkService {

        private final SparkRepo sparkRepo;
        private final QuoteRepo quoteRepo;
        private final UserRepo userRepo;      // ← inject UserRepository

        @Transactional
        public SparkResponse toggleSpark(Long quoteId, String userEmail) {

            Quote quote = quoteRepo.findById(quoteId)
                    .orElseThrow(() -> new RuntimeException("Quote not found"));

            User user = userRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean alreadySparked = sparkRepo
                    .existsByQuoteIdAndUserId(quoteId, user.getId());

            if (alreadySparked) {
                sparkRepo.deleteByQuoteIdAndUserId(quoteId, user.getId());
            } else {
                Spark spark = Spark.builder()
                        .quote(quote)
                        .user(user)                     // ← use user object
                        .build();
                sparkRepo.save(spark);
            }

            long count = sparkRepo.countByQuoteId(quoteId);

            return new SparkResponse(quoteId, !alreadySparked, count);
        }

        public SparkResponse getSparkInfo(Long quoteId, String userEmail) {
            User user = userRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            boolean sparked = sparkRepo
                    .existsByQuoteIdAndUserId(quoteId, user.getId());
            long count = sparkRepo.countByQuoteId(quoteId);

            return new SparkResponse(quoteId, sparked, count);
        }
    }

