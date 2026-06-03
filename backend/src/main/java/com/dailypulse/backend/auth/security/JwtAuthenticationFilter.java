package com.dailypulse.backend.auth.security;

import com.dailypulse.backend.auth.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    private final CustomUserDetailsService userDetailsService;

//    public JwtAuthenticationFilter(
//            JwtService jwtService,
//            CustomUserDetailsService userDetailsService
//    ) {
//
//        this.jwtService = jwtService;
//        this.userDetailsService =
//                userDetailsService;
//    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        final String jwt;

        final String role;

        final String userName;

        if (authHeader == null|| !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        jwt = authHeader.substring(7);

        userName = jwtService.extractUsername(jwt);

        role = jwtService.extractRole(jwt);

        UsernamePasswordAuthenticationToken  authToken =
                new UsernamePasswordAuthenticationToken(
                        userName,
                        null,
                        List.of( new SimpleGrantedAuthority( role )
                        )
                );

        authToken.setDetails(
                new WebAuthenticationDetailsSource()
                        .buildDetails(request)
        );

        SecurityContextHolder
                .getContext()
                .setAuthentication(authToken);



//        if (userName != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//
//            UserDetails userDetails = userDetailsService.loadUserByUsername(userName);
//
//            if (jwtService.isTokenValid(jwt,userDetails.getUsername() )) {
//
//                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
//                                userDetails,
//                                null,
//                                userDetails.getAuthorities()
//                        );
//
//                authToken.setDetails(
//                        new WebAuthenticationDetailsSource()
//                                .buildDetails(request)
//                );
//
//                SecurityContextHolder
//                        .getContext()
//                        .setAuthentication(authToken);
//            }
//        }

        filterChain.doFilter(
                request,
                response
        );
    }
}

