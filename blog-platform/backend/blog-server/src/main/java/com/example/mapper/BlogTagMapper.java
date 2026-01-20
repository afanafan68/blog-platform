// com/example/mapper/BlogTagMapper.java
package com.example.mapper;

import com.example.pojo.entity.BlogTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BlogTagMapper {
    void insert(BlogTag blogTag);
    void deleteByBlogId(@Param("blogId") Long blogId);
    List<BlogTag> findByBlogId(@Param("blogId") Long blogId);
}
