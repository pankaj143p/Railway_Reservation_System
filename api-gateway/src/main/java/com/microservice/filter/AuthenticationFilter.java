package com.microservice.filter;

import com.microservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RouteValidator routeValidator;

    public AuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            var request = exchange.getRequest();

            // Allow all OPTIONS requests to pass through for CORS preflight
            if (request.getMethod() != null && request.getMethod().name().equalsIgnoreCase("OPTIONS")) {
                exchange.getResponse().setStatusCode(HttpStatus.OK);
                return exchange.getResponse().setComplete();
            }

            if (routeValidator.isSecured.test(request)) {
                if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String token = authHeader.substring(7);
                if (!jwtUtil.validateToken(token)) {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String role = jwtUtil.extractRole(token);
                String path = request.getURI().getPath();
                System.out.println("JWT Role: " + role + ", Path: " + path);

if (
    ("ROLE_USER".equals(role)) && (
        path.equals("/api/users/all") ||
        path.equals("/api/users/delete") ||
        path.equals("/api/users/update") ||
        path.equals("/trains/add") ||
        path.equals("/trains/update") ||
        path.equals("/trains/delete") ||
        path.equals("/tickets/all") ||
        path.equals("/payment/all")
    )
) {
    exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
    return exchange.getResponse().setComplete();
}
}
            return chain.filter(exchange);
        };
    }
    public static class Config {
       // Add config properties if needed
    }
}