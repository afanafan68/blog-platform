// com/example/pojo/vo/PublicUserVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicUserVO {
    private Long id;
    private String nickname;
    private String avatar;
    private String bio;
    private String createTime;
}
