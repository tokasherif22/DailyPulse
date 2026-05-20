package com.dailypulse.backend.user.repo;


import com.dailypulse.backend.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository <User, Long>{

    Optional<User> findByEmail(String email);

}
