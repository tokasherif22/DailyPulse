package com.dailypulse.backend.facebook.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FacebookPublishRequest {

    private Long quoteId;
    private String PostText;
    private String Caption;
}
