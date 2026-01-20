// com/example/service/impl/BlogServiceImpl.java
package com.example.service.impl;

import com.example.mapper.*;
import com.example.pojo.dto.BlogCreateDTO;
import com.example.pojo.dto.BlogQueryDTO;
import com.example.pojo.dto.BlogUpdateDTO;
import com.example.pojo.entity.Blog;
import com.example.pojo.entity.BlogLike;
import com.example.pojo.entity.BlogTag;
import com.example.pojo.entity.User;
import com.example.pojo.vo.*;
import com.example.service.BlogService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogMapper blogMapper;
    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final BlogTagMapper blogTagMapper;
    private final BlogLikeMapper blogLikeMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public PageResultVO<BlogListVO> getBlogList(BlogQueryDTO queryDTO) {
        PageHelper.startPage(queryDTO.getPage(), queryDTO.getSize());
        Page<Blog> blogPage = blogMapper.findByCondition(queryDTO);

        List<BlogListVO> records = new ArrayList<>();
        for (Blog blog : blogPage) {
            records.add(convertToBlogListVO(blog));
        }

        return PageResultVO.<BlogListVO>builder()
                .total(blogPage.getTotal())
                .size((long) queryDTO.getSize())
                .current((long) queryDTO.getPage())
                .pages((long) blogPage.getPages())
                .records(records)
                .build();
    }

    @Override
    public BlogDetailVO getBlogDetail(Long id) {
        Blog blog = blogMapper.findById(id);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }

        // 增加浏览量
        blogMapper.incrementViewCount(id);

        User author = userMapper.findById(blog.getUserId());
        var category = categoryMapper.findById(blog.getCategoryId());
        List<SimpleTagVO> tags = tagMapper.findTagsByBlogId(id);

        return BlogDetailVO.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .content(blog.getContent())
                .summary(blog.getSummary())
                .coverImage(blog.getCoverImage())
                .viewCount(blog.getViewCount() + 1)
                .likeCount(blog.getLikeCount())
                .status(blog.getStatus())
                .createTime(blog.getCreateTime() != null ? blog.getCreateTime().format(FORMATTER) : null)
                .updateTime(blog.getUpdateTime() != null ? blog.getUpdateTime().format(FORMATTER) : null)
                .author(SimpleUserVO.builder()
                        .id(author.getId())
                        .nickname(author.getNickname())
                        .avatar(author.getAvatar())
                        .build())
                .category(category != null ? SimpleCategoryVO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .build() : null)
                .tags(tags)
                .build();
    }

    @Override
    @Transactional
    public Long createBlog(Long userId, BlogCreateDTO createDTO) {
        String summary = createDTO.getSummary();
        if (summary == null || summary.isEmpty()) {
            summary = createDTO.getContent().length() > 200
                    ? createDTO.getContent().substring(0, 200)
                    : createDTO.getContent();
        }

        Blog blog = Blog.builder()
                .title(createDTO.getTitle())
                .content(createDTO.getContent())
                .summary(summary)
                .coverImage(createDTO.getCoverImage())
                .userId(userId)
                .categoryId(createDTO.getCategoryId())
                .viewCount(0)
                .likeCount(0)
                .status(createDTO.getStatus() != null ? createDTO.getStatus() : 1)
                .createTime(LocalDateTime.now())
                .updateTime(LocalDateTime.now())
                .build();

        blogMapper.insert(blog);

        // 处理标签
        if (createDTO.getTagIds() != null && !createDTO.getTagIds().isEmpty()) {
            for (Long tagId : createDTO.getTagIds()) {
                BlogTag blogTag = BlogTag.builder()
                        .blogId(blog.getId())
                        .tagId(tagId)
                        .build();
                blogTagMapper.insert(blogTag);
            }
        }

        return blog.getId();
    }

    @Override
    @Transactional
    public void updateBlog(Long id, Long userId, BlogUpdateDTO updateDTO) {
        Blog blog = blogMapper.findById(id);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }
        if (!blog.getUserId().equals(userId)) {
            throw new RuntimeException("无权限修改");
        }

        if (updateDTO.getTitle() != null) {
            blog.setTitle(updateDTO.getTitle());
        }
        if (updateDTO.getContent() != null) {
            blog.setContent(updateDTO.getContent());
        }
        if (updateDTO.getSummary() != null) {
            blog.setSummary(updateDTO.getSummary());
        }
        if (updateDTO.getCoverImage() != null) {
            blog.setCoverImage(updateDTO.getCoverImage());
        }
        if (updateDTO.getCategoryId() != null) {
            blog.setCategoryId(updateDTO.getCategoryId());
        }
        if (updateDTO.getStatus() != null) {
            blog.setStatus(updateDTO.getStatus());
        }
        blog.setUpdateTime(LocalDateTime.now());

        blogMapper.update(blog);

        // 更新标签
        if (updateDTO.getTagIds() != null) {
            blogTagMapper.deleteByBlogId(id);
            for (Long tagId : updateDTO.getTagIds()) {
                BlogTag blogTag = BlogTag.builder()
                        .blogId(id)
                        .tagId(tagId)
                        .build();
                blogTagMapper.insert(blogTag);
            }
        }
    }

    @Override
    @Transactional
    public void deleteBlog(Long id, Long userId) {
        Blog blog = blogMapper.findById(id);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }

        User user = userMapper.findById(userId);
        if (!blog.getUserId().equals(userId) && user.getRole() != 0) {
            throw new RuntimeException("无权限删除");
        }

        blogMapper.deleteById(id);
    }

    @Override
    public PageResultVO<BlogListVO> searchBlog(String keyword, Integer page, Integer size, Long categoryId) {
        PageHelper.startPage(page, size);
        Page<Blog> blogPage = blogMapper.searchByKeyword(keyword, categoryId);

        List<BlogListVO> records = new ArrayList<>();
        for (Blog blog : blogPage) {
            records.add(convertToBlogListVO(blog));
        }

        return PageResultVO.<BlogListVO>builder()
                .total(blogPage.getTotal())
                .size((long) size)
                .current((long) page)
                .pages((long) blogPage.getPages())
                .records(records)
                .build();
    }

    @Override
    public PageResultVO<BlogListVO> getUserBlogs(Long userId, Integer page, Integer size, Integer status) {
        PageHelper.startPage(page, size);
        Page<Blog> blogPage = blogMapper.findByUserIdAndStatus(userId, status);

        List<BlogListVO> records = new ArrayList<>();
        for (Blog blog : blogPage) {
            records.add(convertToBlogListVO(blog));
        }

        return PageResultVO.<BlogListVO>builder()
                .total(blogPage.getTotal())
                .size((long) size)
                .current((long) page)
                .pages((long) blogPage.getPages())
                .records(records)
                .build();
    }

    @Override
    @Transactional
    public void toggleLike(Long blogId, Long userId) {
        BlogLike existLike = blogLikeMapper.findByBlogIdAndUserId(blogId, userId);

        if (existLike != null) {
            blogLikeMapper.delete(existLike.getId());
            blogMapper.decrementLikeCount(blogId);
        } else {
            BlogLike blogLike = BlogLike.builder()
                    .blogId(blogId)
                    .userId(userId)
                    .createTime(LocalDateTime.now())
                    .build();
            blogLikeMapper.insert(blogLike);
            blogMapper.incrementLikeCount(blogId);
        }
    }

    private BlogListVO convertToBlogListVO(Blog blog) {
        User author = userMapper.findById(blog.getUserId());
        var category = categoryMapper.findById(blog.getCategoryId());
        List<SimpleTagVO> tags = tagMapper.findTagsByBlogId(blog.getId());

        return BlogListVO.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .summary(blog.getSummary())
                .coverImage(blog.getCoverImage())
                .viewCount(blog.getViewCount())
                .likeCount(blog.getLikeCount())
                .createTime(blog.getCreateTime() != null ? blog.getCreateTime().format(FORMATTER) : null)
                .author(SimpleUserVO.builder()
                        .id(author.getId())
                        .nickname(author.getNickname())
                        .avatar(author.getAvatar())
                        .build())
                .category(category != null ? SimpleCategoryVO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .build() : null)
                .tags(tags)
                .build();
    }
}
