// com/example/service/impl/CategoryServiceImpl.java
package com.example.service.impl;

import com.example.mapper.BlogMapper;
import com.example.mapper.CategoryMapper;
import com.example.mapper.TagMapper;
import com.example.mapper.UserMapper;
import com.example.pojo.dto.BlogQueryDTO;
import com.example.pojo.entity.Blog;
import com.example.pojo.entity.Category;
import com.example.pojo.entity.User;
import com.example.pojo.vo.*;
import com.example.service.CategoryService;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;
    private final BlogMapper blogMapper;
    private final UserMapper userMapper;
    private final TagMapper tagMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public List<CategoryVO> getCategoryList() {
        List<Category> categories = categoryMapper.findAll();
        List<CategoryVO> result = new ArrayList<>();

        for (Category category : categories) {
            Integer blogCount = blogMapper.countByCategoryId(category.getId());
            result.add(CategoryVO.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .description(category.getDescription())
                    .blogCount(blogCount)
                    .build());
        }

        return result;
    }

    @Override
    public PageResultVO<BlogListVO> getCategoryBlogs(Long categoryId, Integer page, Integer size) {
        BlogQueryDTO queryDTO = new BlogQueryDTO();
        queryDTO.setPage(page);
        queryDTO.setSize(size);
        queryDTO.setCategoryId(categoryId);

        PageHelper.startPage(page, size);
        Page<Blog> blogPage = blogMapper.findByCondition(queryDTO);

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

    private BlogListVO convertToBlogListVO(Blog blog) {
        User author = userMapper.findById(blog.getUserId());
        Category category = categoryMapper.findById(blog.getCategoryId());
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
