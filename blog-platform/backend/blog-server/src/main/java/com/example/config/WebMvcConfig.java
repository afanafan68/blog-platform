// com/example/config/WebMvcConfig.java
package com.example.config;

import com.example.interceptor.JwtInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtInterceptor jwtInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/blog/list",
                        "/api/blog/{id}",
                        "/api/blog/search",
                        "/api/blog/user/{userId}",
                        "/api/user/{id}",
                        "/api/comment/blog/{blogId}",
                        "/api/category/list",
                        "/api/category/{id}/blogs",
                        "/api/tag/list",
                        "/api/tag/hot",
                        "/api/health",
                        "/api/ready",
                        "/api/favorites/list",
                        "/api/favorites/tags",
                        "/api/favorites/check/{blogId}"
                );
    }
}
