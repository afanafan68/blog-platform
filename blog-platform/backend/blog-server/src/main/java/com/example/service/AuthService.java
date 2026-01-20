// com/example/service/AuthService.java
package com.example.service;

import com.example.pojo.dto.UserLoginDTO;
import com.example.pojo.dto.UserRegisterDTO;
import com.example.pojo.vo.LoginVO;
import com.example.pojo.vo.PrivateUserVO;

public interface AuthService {
    PrivateUserVO register(UserRegisterDTO userRegisterDTO);
    LoginVO login(UserLoginDTO userLoginDTO);
    PrivateUserVO getCurrentUserInfo(Long userId);
    LoginVO refreshToken(String token);
    void logout(String token);
    boolean isTokenBlacklisted(String token);
}
