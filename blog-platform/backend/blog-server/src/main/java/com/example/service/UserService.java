// com/example/service/UserService.java
package com.example.service;

import com.example.pojo.dto.PasswordUpdateDTO;
import com.example.pojo.dto.UserProfileDTO;
import com.example.pojo.vo.PrivateUserVO;
import com.example.pojo.vo.PublicUserVO;

public interface UserService {
    PublicUserVO getUserById(Long id);
    PrivateUserVO updateProfile(Long userId, UserProfileDTO profileDTO);
    void updatePassword(Long userId, PasswordUpdateDTO passwordDTO);
    void updateAvatar(Long userId, String avatarUrl);
}
