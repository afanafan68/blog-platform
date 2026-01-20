// com/example/controller/AuthController.java
package com.example.controller;

import com.example.context.BaseContext;
import com.example.pojo.dto.UserLoginDTO;
import com.example.pojo.dto.UserRegisterDTO;
import com.example.pojo.vo.LoginVO;
import com.example.pojo.vo.PrivateUserVO;
import com.example.result.Result;
import com.example.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@RequestBody UserRegisterDTO userRegisterDTO) {
        PrivateUserVO userVO = authService.register(userRegisterDTO);
        Map<String, Object> info = new HashMap<>();
        info.put("userInfo", userVO);
        return Result.success(info, "注册成功");
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody UserLoginDTO userLoginDTO) {
        LoginVO loginVO = authService.login(userLoginDTO);
        return Result.success(loginVO, "登录成功");
    }

    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return Result.success("登出成功");
    }

    @GetMapping("/info")
    public Result<PrivateUserVO> getCurrentUserInfo() {
        Long userId = BaseContext.getCurrentId();
        PrivateUserVO userVO = authService.getCurrentUserInfo(userId);
        return Result.success(userVO);
    }

    @PostMapping("/refresh")
    public Result<LoginVO> refreshToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        LoginVO loginVO = authService.refreshToken(token);
        return Result.success(loginVO);
    }
}
