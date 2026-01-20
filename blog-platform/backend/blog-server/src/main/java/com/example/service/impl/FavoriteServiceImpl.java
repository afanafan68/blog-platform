// com/example/service/impl/FavoriteServiceImpl.java
package com.example.service.impl;

import com.example.mapper.*;
import com.example.pojo.entity.Blog;
import com.example.pojo.entity.Favorite;
import com.example.pojo.entity.FavoriteFolder;
import com.example.pojo.entity.Tag;
import com.example.pojo.entity.User;
import com.example.pojo.vo.*;
import com.example.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteMapper favoriteMapper;
    private final FavoriteFolderMapper favoriteFolderMapper;
    private final BlogMapper blogMapper;
    private final UserMapper userMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    @Transactional
    public void addFavorite(Long userId, Long blogId, String tagName) {
        // 检查博客是否存在
        Blog blog = blogMapper.findById(blogId);
        if (blog == null) {
            throw new RuntimeException("博客不存在");
        }

        // 检查是否已收藏
        Favorite existing = favoriteMapper.findByUserIdAndBlogId(userId, blogId);
        if (existing != null) {
            throw new RuntimeException("已收藏该博客");
        }

        // 如果没有传tagName，使用默认值
        String finalTagName = (tagName == null || tagName.trim().isEmpty()) ? "默认收藏夹" : tagName.trim();

        // 添加收藏
        Favorite favorite = Favorite.builder()
                .userId(userId)
                .blogId(blogId)
                .tagName(finalTagName)
                .createTime(LocalDateTime.now())
                .build();
        favoriteMapper.insert(favorite);
    }

    @Override
    @Transactional
    public void removeFavorite(Long userId, Long blogId) {
        // 检查是否已收藏
        Favorite existing = favoriteMapper.findByUserIdAndBlogId(userId, blogId);
        if (existing == null) {
            throw new RuntimeException("未收藏该博客");
        }

        favoriteMapper.deleteByUserIdAndBlogId(userId, blogId);
    }

    @Override
    public PageResultVO<BlogListVO> getFavoriteList(Long userId, String tag, Integer page, Integer size) {
        // 计算分页偏移量
        int offset = (page - 1) * size;

        // 获取收藏总数（按收藏夹标签名筛选）
        Long total = favoriteMapper.countByUserIdAndTagName(userId, tag);

        // 获取收藏的博客ID列表（按收藏夹标签名筛选）
        List<Long> blogIds = favoriteMapper.findBlogIdsByUserIdAndTagName(userId, tag, offset, size);

        // 转换为BlogListVO列表
        List<BlogListVO> records = new ArrayList<>();
        for (Long blogId : blogIds) {
            Blog blog = blogMapper.findById(blogId);
            if (blog != null) {
                records.add(convertToBlogListVO(blog));
            }
        }

        // 计算总页数
        long pages = total == 0 ? 0 : (total + size - 1) / size;

        return PageResultVO.<BlogListVO>builder()
                .total(total)
                .size((long) size)
                .current((long) page)
                .pages(pages)
                .records(records)
                .build();
    }

    @Override
    public List<FavoriteTagVO> getFavoriteTags(Long userId) {
        return favoriteMapper.findTagsWithCountByUserId(userId);
    }

    @Override
    public Boolean checkFavorite(Long userId, Long blogId) {
        Favorite favorite = favoriteMapper.findByUserIdAndBlogId(userId, blogId);
        return favorite != null;
    }

    @Override
    @Transactional
    public void createFolder(Long userId, String folderName) {
        if (folderName == null || folderName.trim().isEmpty()) {
            throw new RuntimeException("收藏夹名称不能为空");
        }
        
        String trimmedName = folderName.trim();
        
        // 检查是否已存在同名收藏夹
        FavoriteFolder existing = favoriteFolderMapper.findByUserIdAndName(userId, trimmedName);
        if (existing != null) {
            throw new RuntimeException("收藏夹名称已存在");
        }
        
        // 创建收藏夹
        FavoriteFolder folder = FavoriteFolder.builder()
                .name(trimmedName)
                .userId(userId)
                .createTime(LocalDateTime.now())
                .build();
        favoriteFolderMapper.insert(folder);
    }
    
    @Override
    public List<FavoriteFolderVO> getFolders(Long userId) {
        return favoriteFolderMapper.findByUserId(userId);
    }
    
    @Override
    public PageResultVO<BlogListVO> getBlogsByFolderName(Long userId, String folderName, Integer page, Integer size) {
        if (folderName == null || folderName.trim().isEmpty()) {
            throw new RuntimeException("收藏夹名称不能为空");
        }
        // 复用现有方法，因为folderName实际存储在tagName字段
        return getFavoriteList(userId, folderName.trim(), page, size);
    }

    /**
     * 将Blog实体转换为BlogListVO
     */
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
                .author(author != null ? SimpleUserVO.builder()
                        .id(author.getId())
                        .nickname(author.getNickname())
                        .avatar(author.getAvatar())
                        .build() : null)
                .category(category != null ? SimpleCategoryVO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .build() : null)
                .tags(tags)
                .build();
    }
}
