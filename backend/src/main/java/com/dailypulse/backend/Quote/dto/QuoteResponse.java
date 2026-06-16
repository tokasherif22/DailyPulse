package com.dailypulse.backend.Quote.dto;

import com.dailypulse.backend.Quote.model.Status;
import com.dailypulse.backend.Quote.model.Topic;
import lombok.*;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class QuoteResponse {

    private Long id;

    private String text;

    private String createdBy;

    private LocalDateTime createdAt;

    private Topic topic;
    private Status status;
    private Boolean isAIGenerated ;
    private long sparkCount;
    private boolean sparked;
}
