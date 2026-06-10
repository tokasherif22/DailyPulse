package com.dailypulse.backend.auth.service;


import com.dailypulse.backend.auth.Exception.GlobalExceptionHandler;
import com.dailypulse.backend.auth.Exception.UserAlreadyExistsException;
import com.dailypulse.backend.auth.model.AuthResponse;
import com.dailypulse.backend.auth.model.LoginRequest;
import com.dailypulse.backend.auth.model.RegisterRequest;
import com.dailypulse.backend.auth.security.JwtService;
import com.dailypulse.backend.user.dto.model.User;
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

        // check if email already exists — throws 409 Conflict
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("An account with this email already exists.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(request.getRole())
                .build();



        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail(),user.getRole().name());

        System.out.println("Token: " + token);

        return new AuthResponse(token);
    }

    public AuthResponse login (LoginRequest request)
    {
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow();

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matches) {
            throw new RuntimeException(
                    "Invalid credentials"
            );
        }

        String token = jwtService.generateToken(user.getEmail(),user.getRole().name());
        System.out.println("Token: " + token);
        return new AuthResponse(token);
    }


//    logout
}
