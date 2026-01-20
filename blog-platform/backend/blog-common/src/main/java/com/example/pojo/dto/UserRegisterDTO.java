// com/example/pojo/dto/UserRegisterDTO.java
package com.example.pojo.dto;

import lombok.Data;

@Data
public class UserRegisterDTO {
    private String username;
    private String password;
    private String email;
    private String nickname;
}
