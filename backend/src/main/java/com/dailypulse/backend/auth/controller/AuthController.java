package com.dailypulse.backend.auth.controller;


import com.dailypulse.backend.auth.model.AuthResponse;
import com.dailypulse.backend.auth.model.RegisterRequest;
import com.dailypulse.backend.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register( @RequestBody RegisterRequest request ) {

        return authService.register(request);
    }
}
