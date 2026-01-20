// com/example/controller/UserController.java
package com.example.controller;

import com.aliyun.oss.AliOSSUtils;
import com.example.context.BaseContext;
import com.example.pojo.dto.PasswordUpdateDTO;
import com.example.pojo.dto.UserProfileDTO;
import com.example.pojo.vo.PrivateUserVO;
import com.example.pojo.vo.PublicUserVO;
import com.example.result.Result;
import com.example.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Autowired
    private AliOSSUtils aliOSSUtils;

    @GetMapping("/{id}")
    public Result<PublicUserVO> getUserById(@PathVariable Long id) {
        PublicUserVO userVO = userService.getUserById(id);
        return Result.success(userVO);
    }

    @PutMapping("/profile")
    public Result<PrivateUserVO> updateProfile(@RequestBody UserProfileDTO profileDTO) {
        Long userId = BaseContext.getCurrentId();
        PrivateUserVO userVO = userService.updateProfile(userId, profileDTO);
        return Result.success(userVO);
    }

    @PutMapping("/password")
    public Result<Void> updatePassword(@RequestBody PasswordUpdateDTO passwordDTO) {
        Long userId = BaseContext.getCurrentId();
        userService.updatePassword(userId, passwordDTO);
        return Result.success();
    }

    @PostMapping("/avatar")
    public Result<String> uploadAvatar(MultipartFile file) throws Exception {
        Long userId = BaseContext.getCurrentId();
        String avatarUrl = aliOSSUtils.upload(file);
        userService.updateAvatar(userId, avatarUrl);
        return Result.success(avatarUrl, "上传成功");
    }
}
