package com.dailypulse.backend.user.controller;

import com.dailypulse.backend.user.model.User;
import com.dailypulse.backend.user.model.UserResponse;
import com.dailypulse.backend.user.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {


    @Autowired
    UserRepo userRepo;

    @GetMapping("/me")
    public UserResponse me (Authentication authentication){
        String email = authentication.getName();

        User user =  userRepo
                        .findByEmail(email)
                        .orElseThrow();

        return new UserResponse(

                user.getId(),

                user.getFullName(),

                user.getEmail(),

                user.getRole().name()
        );

    }
}
