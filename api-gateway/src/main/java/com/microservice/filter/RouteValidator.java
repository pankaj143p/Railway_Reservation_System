package com.microservice.filter;

import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import java.util.List;

@Component
public class RouteValidator {
    
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    
    public static final List<String> openApiEndPoints = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/users/forgot-password",
            "/api/users/reset-password",
            "/tickets/availability/**",
            "/trains/all",
            "/eureka"
    );

    public Predicate<ServerHttpRequest> isSecured = req -> {
        String requestPath = req.getURI().getPath();
        return openApiEndPoints.stream().noneMatch(
                pattern -> pathMatcher.match(pattern, requestPath));
    };
}