package com.dailypulse.backend.user.repo;


import com.dailypulse.backend.user.dto.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository <User, Long>{

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

}
