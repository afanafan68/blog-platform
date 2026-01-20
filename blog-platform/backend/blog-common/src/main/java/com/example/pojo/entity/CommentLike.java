// com/example/pojo/entity/CommentLike.java
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
public class CommentLike {
    private Long id;
    private Long commentId;
    private Long userId;
    private LocalDateTime createTime;
}
