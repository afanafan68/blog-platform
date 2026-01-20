// com/example/pojo/entity/BlogTag.java
package com.example.pojo.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlogTag {
    private Long id;
    private Long blogId;
    private Long tagId;
}
