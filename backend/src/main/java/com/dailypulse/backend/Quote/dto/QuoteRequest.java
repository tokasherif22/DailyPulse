package com.dailypulse.backend.Quote.dto;


import com.dailypulse.backend.Quote.model.Status;
import com.dailypulse.backend.Quote.model.Topic;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class QuoteRequest {
    private String text;

    private String createdBy;

    private Topic topic;
    private Status status;
    private Boolean isAIGenerated;
    private LocalDateTime scheduledAt;
}
