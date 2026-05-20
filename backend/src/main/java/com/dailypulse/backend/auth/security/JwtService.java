package com.dailypulse.backend.auth.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

//    TODO:
//  1-move secret to environment variables
//  2-use refresh tokens
//  3-rotate secrets

//    private final String SECRET =
//            "dGhpcywIsYXZlcnlTZWN1cmVTZWNyZXRLZXkxMjM=";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + jwtExpiration)
//                        new Date(System.currentTimeMillis()
//                                + 1000 * 60 * 60 * 24)
                )
                .signWith(
                        getSignInKey(),
                        SignatureAlgorithm.HS256
                )
                .compact();
    }

//    // Extract email from token
//    public String extractEmail(String token) {
//        return Jwts.parser()
//                .setSigningKey(getSignInKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();
//    }
//
//    // Validate token
//    public boolean validateToken(String token) {
//        try {
//            Jwts.parser()
//                    .setSigningKey(getSignInKey())
//                    .build()
//                    .parseClaimsJws(token);
//            return true;
//        } catch (JwtException e) {
//            return false;
//        }
//    }

    private Key getSignInKey() {

        byte[] keyBytes =
                Decoders.BASE64.decode(jwtSecret);

        return Keys.hmacShaKeyFor(keyBytes);
    }


}
