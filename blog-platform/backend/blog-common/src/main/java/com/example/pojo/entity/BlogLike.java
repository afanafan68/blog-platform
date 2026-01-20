// com/example/pojo/entity/BlogLike.java
package com.example.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogLike {
    private Long id;
    private Long blogId;
    private Long userId;
    private LocalDateTime createTime;
}
