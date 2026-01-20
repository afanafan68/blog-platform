// com/example/pojo/entity/Favorite.java
package com.example.pojo.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {
    private Long id;
    private Long userId;
    private Long blogId;
    private String tagName;  // 收藏夹标签名
    private LocalDateTime createTime;
}
