package com.dailypulse.backend.facebook.controller;

import com.dailypulse.backend.auth.security.JwtService;
import com.dailypulse.backend.facebook.service.FacebookTokenService;
import com.dailypulse.backend.user.dto.model.User;
import com.dailypulse.backend.user.repo.UserRepo;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

@RestController
@RequestMapping("/api/facebook")
@RequiredArgsConstructor
public class FacebookAuthController {

    @Value("${facebook.app.id}")
    private String appId;

    @Value("${facebook.app.secret}")
    private String appSecret;

    @Value("${facebook.redirect.uri}")
    private String redirectUri;

    private final FacebookTokenService tokenService;

    private final JwtService jwtService;

    @Autowired
    UserRepo userRepo;

    // Step 1 — redirect user to Facebook login
    @GetMapping("/connect")
    public ResponseEntity<Map<String, String>> connect(Authentication auth) {

        // encode the user's email in the state parameter
        String state = Base64.getEncoder().encodeToString(
                auth.getName().getBytes()
        );



        String url = "https://www.facebook.com/v18.0/dialog/oauth"
                + "?client_id=" + appId
                + "&redirect_uri=" + redirectUri
                + "&scope=pages_manage_posts,pages_read_engagement"
                + "&state=" + state;  // ← pass user identity

        return ResponseEntity.ok(Map.of("authUrl", url));
    }

    // Step 2 — Facebook redirects back with a code
    @GetMapping("/callback")
    public ResponseEntity<Void> callback(
            @RequestParam String code,
            @RequestParam String state,       // ← receive user identity
            HttpServletResponse response) throws IOException {
        try{
            System.out.println("CODE: " + code);
            System.out.println("STATE: " + state);

            // decode user email from state
            String userEmail = new String(Base64.getDecoder().decode(state));
            System.out.println("USER EMAIL: " + userEmail);

            tokenService.exchangeCodeForToken(code, userEmail);
            // redirect back to Angular
            response.sendRedirect("http://localhost:4200/settings?facebook=connected");
        }catch (Exception e) {
            System.out.println("CALLBACK ERROR: " + e.getMessage());
            e.printStackTrace();
            response.sendRedirect("http://localhost:4200/settings?facebook=error");
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/disconnect")
    public ResponseEntity<Void> disconnect(Authentication auth) {
        tokenService.revokeToken(auth.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Boolean>> status(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(
                Map.of("connected", user.getFacebookToken() != null)
        );
    }
}
