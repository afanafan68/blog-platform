// com/example/pojo/vo/CommentVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentVO {
    private Long id;
    private String content;
    private String createTime;
    private SimpleUserVO user;
    private Long parentId;
    private Integer likeCount;
    private List<CommentVO> children;
}
