// package com.microservices.filter;//package com.microservices.filter;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;

// @Component
// public class GatewayHeaderFilter extends OncePerRequestFilter {

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain filterChain)
//         throws ServletException, IOException {

//         String fromGateway = request.getHeader("X-GATEWAY");
//         String path = request.getRequestURI();
//         if (path.startsWith("/actuator") || path.equals("/login")) {
//             filterChain.doFilter(request, response);
//             return;
//         }

//         if (!"yes".equals(fromGateway)) {
//             response.setStatus(HttpServletResponse.SC_FORBIDDEN);
//             response.getWriter().write("Access denied: Use API Gateway");
//             return;
//         }

//         filterChain.doFilter(request, response);
//     }
// }