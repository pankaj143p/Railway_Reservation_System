// package com.microservice.filter;

// import com.microservice.util.JwtUtil;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.cloud.gateway.filter.GatewayFilter;
// import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
// import org.springframework.http.HttpHeaders;
// import org.springframework.http.HttpStatus;
// import org.springframework.stereotype.Component;

// @Component
// public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Autowired
//     private RouteValidator routeValidator;

//     public AuthenticationFilter() {
//         super(Config.class);
//     }

//     @Override
//     public GatewayFilter apply(Config config) {
//         return (exchange, chain) -> {
//             var request = exchange.getRequest();

//             // Allow all OPTIONS requests to pass through for CORS preflight
//             if (request.getMethod() != null && request.getMethod().name().equalsIgnoreCase("OPTIONS")) {
//                 exchange.getResponse().setStatusCode(HttpStatus.OK);
//                 return exchange.getResponse().setComplete();
//             }

//             if (routeValidator.isSecured.test(request)) {
//                 if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
//                     exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                     return exchange.getResponse().setComplete();
//                 }

//                 String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//                 if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//                     exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                     return exchange.getResponse().setComplete();
//                 }

//                 String token = authHeader.substring(7);
//                 if (!jwtUtil.validateToken(token)) {
//                     exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
//                     return exchange.getResponse().setComplete();
//                 }

//                 String role = jwtUtil.extractRole(token);
//                 String path = request.getURI().getPath();
//                 System.out.println("JWT Role: " + role + ", Path: " + path);

// if (
//     ("ROLE_USER".equals(role)) && (
//         path.equals("/api/users/all") ||
//         path.equals("/api/users/delete") ||
//         path.equals("/api/users/update") ||
//         path.equals("/trains/add") ||
//         path.equals("/trains/update") ||
//         path.equals("/trains/delete") ||
//         path.equals("/tickets/all") ||
//         path.equals("/payment/all")
//     )
// ) {
//     exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
//     return exchange.getResponse().setComplete();
// }
// }
//             return chain.filter(exchange);
//         };
//     }
//     public static class Config {
//        // Add config properties if needed
//     }
// }

package com.microservice.filter;

import com.microservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
            var response = exchange.getResponse();

            // Allow all OPTIONS requests to pass through for CORS preflight
            if (request.getMethod() != null && (request.getMethod().name().equalsIgnoreCase("OPTIONS") || request.getMethod().name().equalsIgnoreCase("PATCH"))) {
                response.setStatusCode(HttpStatus.OK);
                return response.setComplete();
            }

            if (routeValidator.isSecured.test(request)) {
                if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                    System.out.println("No Authorization header found");
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return response.setComplete();
                }

                String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    System.out.println("Invalid Authorization header format");
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return response.setComplete();
                }

                String token = authHeader.substring(7);
                if (!jwtUtil.validateToken(token)) {
                    System.out.println("Invalid JWT token");
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return response.setComplete();
                }

                String role = jwtUtil.extractRole(token);
                String path = request.getURI().getPath();
                HttpMethod method = request.getMethod();
                
                System.out.println("JWT Role: " + role + ", Path: " + path + ", Method: " + method);

                //  Role-based access control with proper path patterns
                if ("ROLE_USER".equals(role)) {
                    // Block regular users from admin operations
                    if (isAdminOnlyOperation(path, method)) {
                        System.out.println("FORBIDDEN: User trying to access admin operation");
                        response.setStatusCode(HttpStatus.FORBIDDEN);
                        return response.setComplete();
                    }
                }
                
                //  Admin users (ROLE_ADMIN) have access to all operations
                if ("ROLE_ADMIN".equals(role)) {
                    System.out.println("ADMIN access granted for: " + path);
                    // Allow all operations for admin
                }
            }
            
            return chain.filter(exchange);
        };
    }

    /**
     *  Check if the operation is admin-only
     */
    private boolean isAdminOnlyOperation(String path, HttpMethod method) {
        // User management operations (admin only)
        if (path.startsWith("/api/users/")) {
            // Allow GET /api/users/profile for all users (their own profile)
            if (path.equals("/api/users/profile") && HttpMethod.GET.equals(method)) {
                return false;
            }
            
            // Admin-only user operations
            if (path.equals("/api/users") && HttpMethod.GET.equals(method)) return true; // Get all users
            if (path.matches("/api/users/\\d+") && HttpMethod.PUT.equals(method)) return true; // Update user
            if (path.matches("/api/users/\\d+") && HttpMethod.DELETE.equals(method)) return true; // Delete user
            if (path.matches("/api/users/\\d+/reactivate") && HttpMethod.PATCH.equals(method)) return true; // Reactivate user
            if (path.equals("/api/users/register") && HttpMethod.POST.equals(method)) return true; // Create user (admin creates users)
        }
        
        // Train management operations (admin only)
        if (path.startsWith("/api/trains/")) {
            if (HttpMethod.POST.equals(method)) return true; // Add train
            if (HttpMethod.PUT.equals(method)) return true; // Update train
            if (HttpMethod.DELETE.equals(method)) return true; // Delete train
        }
        
        // In the isAdminOnlyOperation method:
if (path.matches("/api/users/\\d+") && HttpMethod.PATCH.equals(method)) return true; // Delete user (soft delete)
        // Ticket management - view all tickets (admin only)
        if (path.equals("/api/tickets") && HttpMethod.GET.equals(method)) {
            return true; // Only admin can see all tickets
        }
        
        // Payment management - view all payments (admin only)
        if (path.equals("/api/payments") && HttpMethod.GET.equals(method)) {
            return true; // Only admin can see all payments
        }
        
        return false; // Allow by default
    }

    public static class Config {
        // Add config properties if needed
    }
}