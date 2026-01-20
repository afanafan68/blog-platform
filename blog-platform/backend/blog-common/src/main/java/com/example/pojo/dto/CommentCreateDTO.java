// com/example/pojo/dto/CommentCreateDTO.java
package com.example.pojo.dto;

import lombok.Data;

@Data
public class CommentCreateDTO {
    private Long blogId;
    private String content;
    private Long parentId;
}
