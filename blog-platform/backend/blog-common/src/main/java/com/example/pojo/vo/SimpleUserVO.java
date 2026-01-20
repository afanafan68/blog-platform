// com/example/pojo/vo/SimpleUserVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleUserVO {
    private Long id;
    private String nickname;
    private String avatar;
}
