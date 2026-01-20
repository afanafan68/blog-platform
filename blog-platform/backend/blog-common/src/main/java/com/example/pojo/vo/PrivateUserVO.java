// com/example/pojo/vo/PrivateUserVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrivateUserVO {
    private Long id;
    private String nickname;
    private String avatar;
    private String bio;
    private String createTime;
    private String username;
    private String email;
    private Integer role;
}
