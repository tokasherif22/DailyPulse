package com.dailypulse.backend.spark.model;

import com.dailypulse.backend.Quote.model.Quote;
import com.dailypulse.backend.user.dto.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "sparks",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"quote_id", "user_id"}  // one spark per user per quote
        )
)
public class Spark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quote_id", nullable = false)
    private Quote quote;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
