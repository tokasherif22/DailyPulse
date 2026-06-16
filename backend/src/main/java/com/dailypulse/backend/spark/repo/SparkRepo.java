package com.dailypulse.backend.spark.repo;


import com.dailypulse.backend.spark.model.Spark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SparkRepo extends JpaRepository<Spark,Long> {

    boolean existsByQuoteIdAndUserId(Long quoteId, Long userId);


    void deleteByQuoteIdAndUserId(Long quoteId, Long userId);

    long countByQuoteId(Long quoteId);
}
