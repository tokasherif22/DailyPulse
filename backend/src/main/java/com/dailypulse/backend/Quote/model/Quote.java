package com.dailypulse.backend.Quote.model;

import com.dailypulse.backend.spark.model.Spark;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


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

    @Enumerated(EnumType.STRING)
    private Topic topic ;

//    @UpdateTimestamp // saved upon update
    private LocalDateTime scheduledAt;

    private Boolean isAIGenerated;

    @Enumerated(EnumType.STRING)
    private Status status;

    // ← add this relationship
    @OneToMany(mappedBy = "quote", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Spark> sparks = new ArrayList<>();

}
