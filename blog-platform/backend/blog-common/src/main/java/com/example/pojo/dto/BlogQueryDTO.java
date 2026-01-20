// com/example/pojo/dto/BlogQueryDTO.java
package com.example.pojo.dto;

import lombok.Data;

@Data
public class BlogQueryDTO {
    private Integer page = 1;
    private Integer size = 10;
    private Long categoryId;
    private Long tagId;
    private Long userId;
}
