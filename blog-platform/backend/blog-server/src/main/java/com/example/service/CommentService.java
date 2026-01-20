// com/example/service/CommentService.java
package com.example.service;

import com.example.pojo.dto.CommentCreateDTO;
import com.example.pojo.vo.CommentVO;

import java.util.List;

public interface CommentService {
    CommentVO createComment(Long userId, CommentCreateDTO createDTO);
    void deleteComment(Long id, Long userId);
    void toggleLike(Long commentId, Long userId);
    List<CommentVO> getBlogComments(Long blogId);
}
