// com/example/interceptor/JwtInterceptor.java
package com.example.interceptor;

import com.example.Utils.JwtUtils;
import com.example.context.BaseContext;
import com.example.properties.JwtProperties;
import com.example.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtProperties jwtProperties;
    private final AuthService authService;  // 注入AuthService

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equals(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            response.setStatus(401);
            return false;
        }

        String pureToken = token.substring(7);

        try {
            // 检查token是否在黑名单中
            if (authService.isTokenBlacklisted(pureToken)) {
                response.setStatus(401);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"code\":401,\"message\":\"Token已失效，请重新登录\",\"data\":null}");
                return false;
            }

            Claims claims = JwtUtils.parseJwt(pureToken, jwtProperties.getSecretKey());
            Long userId = Long.valueOf(claims.get(jwtProperties.getDataName()).toString());
            BaseContext.setCurrentId(userId);
            return true;
        } catch (Exception e) {
            response.setStatus(401);
            return false;
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContext.removeCurrentId();
    }
}
