// com/example/service/impl/AuthServiceImpl.java
package com.example.service.impl;

import com.example.Utils.JwtUtils;
import com.example.mapper.FavoriteFolderMapper;
import com.example.mapper.UserMapper;
import com.example.pojo.dto.UserLoginDTO;
import com.example.pojo.dto.UserRegisterDTO;
import com.example.pojo.entity.FavoriteFolder;
import com.example.pojo.entity.User;
import com.example.pojo.vo.LoginVO;
import com.example.pojo.vo.PrivateUserVO;
import com.example.properties.JwtProperties;
import com.example.redis.RedisUtils;
import com.example.service.AuthService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.apache.http.auth.AuthScheme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
//@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private FavoriteFolderMapper favoriteFolderMapper;
    @Autowired
    private JwtProperties jwtProperties;
    @Autowired
    private RedisUtils<String> redisUtils;  // 注入RedisUtils
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
    
    // 默认收藏夹名称
    private static final String DEFAULT_FOLDER_NAME = "默认收藏夹";

    // Token黑名单的Redis Key前缀
    private static final String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";

    @Override
    public PrivateUserVO register(UserRegisterDTO userRegisterDTO) {
        User existUser = userMapper.findByUsername(userRegisterDTO.getUsername());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        User user = User.builder()
                .username(userRegisterDTO.getUsername())
                .password(DigestUtils.md5DigestAsHex(userRegisterDTO.getPassword().getBytes()))
                .nickname(userRegisterDTO.getNickname() != null ? userRegisterDTO.getNickname() : userRegisterDTO.getUsername())
                .email(userRegisterDTO.getEmail())
                .role(1)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .build();

        userMapper.insert(user);
        
        // 为新用户创建默认收藏夹
        FavoriteFolder defaultFolder = FavoriteFolder.builder()
                .name(DEFAULT_FOLDER_NAME)
                .userId(user.getId())
                .createTime(LocalDateTime.now())
                .build();
        favoriteFolderMapper.insert(defaultFolder);

        return convertToPrivateUserVO(user);
    }

    @Override
    public LoginVO login(UserLoginDTO userLoginDTO) {
        User user = userMapper.findByUsername(userLoginDTO.getUsername());
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        String encryptedPassword = DigestUtils.md5DigestAsHex(userLoginDTO.getPassword().getBytes());
        if (!encryptedPassword.equals(user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put(jwtProperties.getDataName(), user.getId());
        String token = JwtUtils.generateJwt(claims, jwtProperties.getSecretKey(), jwtProperties.getTtl());

        PrivateUserVO userVO = convertToPrivateUserVO(user);

        return LoginVO.builder()
                .token(token)
                .tokenHead("Bearer ")
                .userInfo(userVO)
                .build();
    }

    @Override
    public void logout(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        try {
            // 解析token获取过期时间
            Claims claims = JwtUtils.parseJwt(token, jwtProperties.getSecretKey());
            long expiration = claims.getExpiration().getTime();
            long currentTime = System.currentTimeMillis();

            // 计算token剩余有效时间（毫秒）
            long ttl = expiration - currentTime;

            if (ttl > 0) {
                // 将token加入黑名单，过期时间设置为token的剩余有效时间
                String blacklistKey = TOKEN_BLACKLIST_PREFIX + token;
                redisUtils.setex(blacklistKey, "1", ttl);
            }
        } catch (Exception e) {
            // token已过期或无效，无需加入黑名单
        }
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        String blacklistKey = TOKEN_BLACKLIST_PREFIX + token;
        return redisUtils.keyExists(blacklistKey);
    }

    @Override
    public PrivateUserVO getCurrentUserInfo(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        return convertToPrivateUserVO(user);
    }

    @Override
    public LoginVO refreshToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        // 检查旧token是否在黑名单中
        if (isTokenBlacklisted(token)) {
            throw new RuntimeException("Token已失效");
        }

        try {
            Claims claims = JwtUtils.parseJwt(token, jwtProperties.getSecretKey());
            Long userId = Long.valueOf(claims.get(jwtProperties.getDataName()).toString());

            // 将旧token加入黑名单
            long expiration = claims.getExpiration().getTime();
            long currentTime = System.currentTimeMillis();
            long ttl = expiration - currentTime;
            if (ttl > 0) {
                String blacklistKey = TOKEN_BLACKLIST_PREFIX + token;
                redisUtils.setex(blacklistKey, "1", ttl);
            }

            // 生成新token
            User user = userMapper.findById(userId);
            Map<String, Object> newClaims = new HashMap<>();
            newClaims.put(jwtProperties.getDataName(), userId);
            String newToken = JwtUtils.generateJwt(newClaims, jwtProperties.getSecretKey(), jwtProperties.getTtl());

            PrivateUserVO userVO = convertToPrivateUserVO(user);

            return LoginVO.builder()
                    .token(newToken)
                    .tokenHead("Bearer ")
                    .userInfo(userVO)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Token无效或已过期");
        }
    }

    private PrivateUserVO convertToPrivateUserVO(User user) {
        return PrivateUserVO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .email(user.getEmail())
                .bio(user.getBio())
                .role(user.getRole())
                .createTime(user.getCreateTime() != null ? user.getCreateTime().format(FORMATTER) : null)
                .build();
    }
}
