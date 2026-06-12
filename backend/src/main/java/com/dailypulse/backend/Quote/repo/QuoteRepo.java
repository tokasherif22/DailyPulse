package com.dailypulse.backend.Quote.repo;

import com.dailypulse.backend.Quote.model.Quote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuoteRepo extends JpaRepository<Quote,Long> {

    List<Quote> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Quote> findByCreatedBy (String createdBy);
    Optional<Quote> findById(Long id);
}
