// com/example/pojo/dto/BlogUpdateDTO.java
package com.example.pojo.dto;

import lombok.Data;

import java.util.List;

@Data
public class BlogUpdateDTO {
    private String title;
    private String content;
    private String summary;
    private String coverImage;
    private Long categoryId;
    private List<Long> tagIds;
    private Integer status;
}
