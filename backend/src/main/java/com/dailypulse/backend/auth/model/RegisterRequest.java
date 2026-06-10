package com.dailypulse.backend.auth.model;

import com.dailypulse.backend.user.dto.model.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;
    private Role role;

}
