package com.example.Utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

public class JwtUtils {
    
    /**
     * 将字符串密钥转换为 SecretKey 对象
     * @param signKey 字符串密钥
     * @return SecretKey 对象
     */
    private static SecretKey getSecretKey(String signKey) {
        byte[] keyBytes = signKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public static String generateJwt(Map<String, Object> claims, String signKey, Long expire) {
        SecretKey secretKey = getSecretKey(signKey);
        String jwt = Jwts.builder()
                .addClaims(claims)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .setExpiration(new Date(System.currentTimeMillis() + expire))
                .compact();
        return jwt;
    }

    public static Claims parseJwt(String jwt, String signKey) {
        SecretKey secretKey = getSecretKey(signKey);
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt)
                .getBody();
        return claims;
    }
}
