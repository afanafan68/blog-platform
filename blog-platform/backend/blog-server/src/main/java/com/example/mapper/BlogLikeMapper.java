// com/example/mapper/BlogLikeMapper.java
package com.example.mapper;

import com.example.pojo.entity.BlogLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BlogLikeMapper {
    BlogLike findByBlogIdAndUserId(@Param("blogId") Long blogId, @Param("userId") Long userId);
    void insert(BlogLike blogLike);
    void delete(@Param("id") Long id);
}
