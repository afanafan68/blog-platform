// com/example/service/impl/UserServiceImpl.java
package com.example.service.impl;

import com.example.mapper.UserMapper;
import com.example.pojo.dto.PasswordUpdateDTO;
import com.example.pojo.dto.UserProfileDTO;
import com.example.pojo.entity.User;
import com.example.pojo.vo.PrivateUserVO;
import com.example.pojo.vo.PublicUserVO;
import com.example.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public PublicUserVO getUserById(Long id) {
        User user = userMapper.findById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        return PublicUserVO.builder()
                .id(user.getId())
                .nickname(user.getNickname())
                .avatar(user.getAvatar())
                .bio(user.getBio())
                .createTime(user.getCreateTime() != null ? user.getCreateTime().format(FORMATTER) : null)
                .build();
    }

    @Override
    public PrivateUserVO updateProfile(Long userId, UserProfileDTO profileDTO) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        if (profileDTO.getNickname() != null) {
            user.setNickname(profileDTO.getNickname());
        }
        if (profileDTO.getBio() != null) {
            user.setBio(profileDTO.getBio());
        }
        if (profileDTO.getEmail() != null) {
            user.setEmail(profileDTO.getEmail());
        }
        user.setUpdateTime(LocalDateTime.now());

        userMapper.update(user);

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

    @Override
    public void updatePassword(Long userId, PasswordUpdateDTO passwordDTO) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        String oldEncrypted = DigestUtils.md5DigestAsHex(passwordDTO.getOldPassword().getBytes());
        if (!user.getPassword().equals(oldEncrypted)) {
            throw new RuntimeException("原密码错误");
        }

        String newEncrypted = DigestUtils.md5DigestAsHex(passwordDTO.getNewPassword().getBytes());
        user.setPassword(newEncrypted);
        user.setUpdateTime(LocalDateTime.now());

        userMapper.update(user);
    }

    @Override
    public void updateAvatar(Long userId, String avatarUrl) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        user.setAvatar(avatarUrl);
        user.setUpdateTime(LocalDateTime.now());
        userMapper.update(user);
    }
}
