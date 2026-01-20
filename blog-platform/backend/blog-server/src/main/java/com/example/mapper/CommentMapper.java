// com/example/mapper/CommentMapper.java
package com.example.mapper;

import com.example.pojo.entity.Comment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {
    Comment findById(@Param("id") Long id);
    List<Comment> findByBlogId(@Param("blogId") Long blogId);
    void insert(Comment comment);
    void deleteById(@Param("id") Long id);
    void incrementLikeCount(@Param("id") Long id);
    void decrementLikeCount(@Param("id") Long id);
}
