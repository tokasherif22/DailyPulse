package com.dailypulse.backend.Quote.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuoteRequest {
    private String text;

    private String createdBy;
}
