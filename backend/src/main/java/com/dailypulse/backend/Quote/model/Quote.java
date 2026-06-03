package com.dailypulse.backend.Quote.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "quotes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Quote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private String createdBy;
// the same as the email in the users table
//    @ManyToOne
//    @JoinColumn(name = "created_by")
//    private User createdBy;

//    @UpdateTimestamp // saved upon update
    @CreationTimestamp //Default
    private LocalDateTime createdAt;


}
