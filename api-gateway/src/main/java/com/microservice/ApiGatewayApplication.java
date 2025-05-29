package com.microservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}
//	@Bean
//	public WebFilter corsFilter() {
//		return (exchange, chain) -> {
//			ServerHttpResponse response = exchange.getResponse();
//			HttpHeaders headers = response.getHeaders();
//			headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
//			headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//			headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//			headers.set("Access-Control-Max-Age", "3600");
//			return chain.filter(exchange);
//		};
//	}

}
