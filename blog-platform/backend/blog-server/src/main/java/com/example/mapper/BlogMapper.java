// com/example/mapper/BlogMapper.java
package com.example.mapper;

import com.example.pojo.dto.BlogQueryDTO;
import com.example.pojo.entity.Blog;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface BlogMapper {
    Blog findById(@Param("id") Long id);
    Page<Blog> findByCondition(BlogQueryDTO queryDTO);
    Page<Blog> findByUserId(@Param("userId") Long userId);
    Page<Blog> searchByKeyword(@Param("keyword") String keyword);
    Integer countByCategoryId(@Param("categoryId") Long categoryId);
    void insert(Blog blog);
    void update(Blog blog);
    void deleteById(@Param("id") Long id);
    void incrementViewCount(@Param("id") Long id);
    void incrementLikeCount(@Param("id") Long id);
    void decrementLikeCount(@Param("id") Long id);
}
