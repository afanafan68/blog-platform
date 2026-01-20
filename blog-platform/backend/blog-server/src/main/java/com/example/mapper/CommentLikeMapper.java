// com/example/mapper/CommentLikeMapper.java
package com.example.mapper;

import com.example.pojo.entity.CommentLike;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CommentLikeMapper {
    CommentLike findByCommentIdAndUserId(@Param("commentId") Long commentId, @Param("userId") Long userId);
    void insert(CommentLike commentLike);
    void delete(@Param("id") Long id);
}
