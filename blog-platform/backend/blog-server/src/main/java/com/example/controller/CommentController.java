// com/example/controller/CommentController.java
package com.example.controller;

import com.example.context.BaseContext;
import com.example.pojo.dto.CommentCreateDTO;
import com.example.pojo.vo.CommentVO;
import com.example.result.Result;
import com.example.service.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public Result<CommentVO> createComment(@RequestBody CommentCreateDTO createDTO, HttpServletRequest request) {
        Long userId = BaseContext.getCurrentId();
        CommentVO commentVO = commentService.createComment(userId, createDTO);
        return Result.success(commentVO);
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteComment(@PathVariable Long id, HttpServletRequest request) {
        Long userId = BaseContext.getCurrentId();
        commentService.deleteComment(id, userId);
        return Result.success();
    }

    @PostMapping("/{id}/like")
    public Result<Void> likeComment(@PathVariable Long id, HttpServletRequest request) {
        Long userId = BaseContext.getCurrentId();
        commentService.toggleLike(id, userId);
        return Result.success();
    }

    @GetMapping("/blog/{blogId}")
    public Result<List<CommentVO>> getBlogComments(@PathVariable Long blogId) {
        List<CommentVO> comments = commentService.getBlogComments(blogId);
        return Result.success(comments);
    }
}
