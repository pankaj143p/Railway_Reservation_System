package com.microservice.filter;

import java.util.function.Predicate;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class RouteValidator {
    public static final List<String> openApiEndPoints = List.of(
            "/api/users/register",
            "/api/users/login",
            "/api/users/forgot-password",
            "/api/users/reset-password",
            "trains/all",
            "eureka"
    );

    public Predicate<ServerHttpRequest> isSecured = req ->
            openApiEndPoints.stream().noneMatch(
                    uri -> req.getURI().getPath().contains(uri));
}