// com/example/service/impl/CommentServiceImpl.java
package com.example.service.impl;

import com.example.mapper.CommentLikeMapper;
import com.example.mapper.CommentMapper;
import com.example.mapper.UserMapper;
import com.example.pojo.dto.CommentCreateDTO;
import com.example.pojo.entity.Comment;
import com.example.pojo.entity.CommentLike;
import com.example.pojo.entity.User;
import com.example.pojo.vo.CommentVO;
import com.example.pojo.vo.SimpleUserVO;
import com.example.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final UserMapper userMapper;
    private final CommentLikeMapper commentLikeMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public CommentVO createComment(Long userId, CommentCreateDTO createDTO) {
        Comment comment = Comment.builder()
                .blogId(createDTO.getBlogId())
                .userId(userId)
                .content(createDTO.getContent())
                .parentId(createDTO.getParentId())
                .likeCount(0)
                .createTime(LocalDateTime.now())
                .build();

        commentMapper.insert(comment);

        User user = userMapper.findById(userId);

        return CommentVO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createTime(comment.getCreateTime().format(FORMATTER))
                .parentId(comment.getParentId())
                .likeCount(0)
                .user(SimpleUserVO.builder()
                        .id(user.getId())
                        .nickname(user.getNickname())
                        .avatar(user.getAvatar())
                        .build())
                .children(new ArrayList<>())
                .build();
    }

    @Override
    @Transactional
    public void deleteComment(Long id, Long userId) {
        Comment comment = commentMapper.findById(id);
        if (comment == null) {
            throw new RuntimeException("评论不存在");
        }

        User user = userMapper.findById(userId);
        if (!comment.getUserId().equals(userId) && user.getRole() != 0) {
            throw new RuntimeException("无权限删除");
        }

        commentMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void toggleLike(Long commentId, Long userId) {
        CommentLike existLike = commentLikeMapper.findByCommentIdAndUserId(commentId, userId);

        if (existLike != null) {
            commentLikeMapper.delete(existLike.getId());
            commentMapper.decrementLikeCount(commentId);
        } else {
            CommentLike commentLike = CommentLike.builder()
                    .commentId(commentId)
                    .userId(userId)
                    .createTime(LocalDateTime.now())
                    .build();
            commentLikeMapper.insert(commentLike);
            commentMapper.incrementLikeCount(commentId);
        }
    }

    @Override
    public List<CommentVO> getBlogComments(Long blogId) {
        List<Comment> allComments = commentMapper.findByBlogId(blogId);

        // 构建评论树
        Map<Long, CommentVO> commentMap = allComments.stream()
                .collect(Collectors.toMap(Comment::getId, this::convertToCommentVO));

        List<CommentVO> rootComments = new ArrayList<>();

        for (Comment comment : allComments) {
            CommentVO vo = commentMap.get(comment.getId());
            if (comment.getParentId() == null) {
                rootComments.add(vo);
            } else {
                CommentVO parentVO = commentMap.get(comment.getParentId());
                if (parentVO != null) {
                    if (parentVO.getChildren() == null) {
                        parentVO.setChildren(new ArrayList<>());
                    }
                    parentVO.getChildren().add(vo);
                }
            }
        }

        return rootComments;
    }

    private CommentVO convertToCommentVO(Comment comment) {
        User user = userMapper.findById(comment.getUserId());

        return CommentVO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .createTime(comment.getCreateTime() != null ? comment.getCreateTime().format(FORMATTER) : null)
                .parentId(comment.getParentId())
                .likeCount(comment.getLikeCount())
                .user(SimpleUserVO.builder()
                        .id(user.getId())
                        .nickname(user.getNickname())
                        .avatar(user.getAvatar())
                        .build())
                .children(new ArrayList<>())
                .build();
    }
}
