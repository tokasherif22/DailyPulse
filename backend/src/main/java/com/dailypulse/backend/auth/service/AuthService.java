package com.dailypulse.backend.auth.service;


import com.dailypulse.backend.auth.model.AuthResponse;
import com.dailypulse.backend.auth.model.RegisterRequest;
import com.dailypulse.backend.auth.security.JwtService;
import com.dailypulse.backend.user.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .build();



        userRepository.save(user);

        String token =
                jwtService.generateToken(user.getEmail());

        System.out.println("Token" + token);

        return new AuthResponse(token);
    }
}
