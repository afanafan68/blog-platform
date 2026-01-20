package com.example.component;

import com.example.constants.JwtClaimsConstants;
import com.example.redis.RedisUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RedisComponent {
    @Autowired
    private RedisUtils redisUtils;

    public void addJwt2BlackList(Long userId, String jwt) {
        redisUtils.set(JwtClaimsConstants.JWT_BLACK_LIST_PREFIX + userId, jwt);
    }

    public boolean jwtExistBlackList(Long userId) {
        return redisUtils.keyExists(JwtClaimsConstants.JWT_BLACK_LIST_PREFIX + userId);
    }
}
