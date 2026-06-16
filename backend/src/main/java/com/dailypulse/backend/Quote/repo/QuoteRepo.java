package com.dailypulse.backend.Quote.repo;

import com.dailypulse.backend.Quote.model.Quote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QuoteRepo extends JpaRepository<Quote,Long> {

    List<Quote> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Quote> findByCreatedBy (String createdBy);
    Optional<Quote> findById(Long id);

    // global feed — published quotes sorted by spark count
    @Query("""
        SELECT q FROM Quote q
        WHERE q.status = 'PUBLISHED'
        ORDER BY SIZE(q.sparks) DESC, q.createdAt DESC
    """)
    List<Quote> findGlobalFeed(Pageable pageable);

//    @Query("""
//    SELECT q FROM Quote q
//    WHERE q.status = 'PUBLISHED'
//    AND q.createdAt BETWEEN :start AND :end
//    ORDER BY SIZE(q.sparks) DESC
//""")
//    List<Quote> findTopSparkedToday(
//            @Param("start") LocalDateTime start,
//            @Param("end") LocalDateTime end,
//            Pageable pageable
//    );

    @Query("""
    SELECT q FROM Quote q
    WHERE q.status = 'PUBLISHED'
    AND SIZE(q.sparks) > 0
    ORDER BY SIZE(q.sparks) DESC
""")
    List<Quote> findTopSparked(Pageable pageable);
}
