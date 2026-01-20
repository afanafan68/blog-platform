// com/example/pojo/vo/BlogListVO.java
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
public class BlogListVO {
    private Long id;
    private String title;
    private String summary;
    private String coverImage;
    private Integer viewCount;
    private Integer likeCount;
    private String createTime;
    private SimpleUserVO author;
    private SimpleCategoryVO category;
    private List<SimpleTagVO> tags;
}
