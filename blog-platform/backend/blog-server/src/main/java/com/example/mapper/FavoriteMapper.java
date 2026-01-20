// com/example/mapper/FavoriteMapper.java
package com.example.mapper;

import com.example.pojo.entity.Favorite;
import com.example.pojo.vo.FavoriteTagVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FavoriteMapper {
    
    /**
     * 根据用户ID和博客ID查询收藏记录
     */
    Favorite findByUserIdAndBlogId(@Param("userId") Long userId, @Param("blogId") Long blogId);
    
    /**
     * 插入收藏记录
     */
    void insert(Favorite favorite);
    
    /**
     * 根据用户ID和博客ID删除收藏记录
     */
    void deleteByUserIdAndBlogId(@Param("userId") Long userId, @Param("blogId") Long blogId);
    
    /**
     * 获取用户收藏的博客ID列表（分页）
     */
    List<Long> findBlogIdsByUserId(@Param("userId") Long userId, 
                                    @Param("tagId") Long tagId,
                                    @Param("offset") Integer offset, 
                                    @Param("size") Integer size);
    
    /**
     * 获取用户收藏总数
     */
    Long countByUserId(@Param("userId") Long userId, @Param("tagId") Long tagId);
    
    /**
     * 获取用户收藏的博客所包含的标签列表及对应收藏数量
     */
    List<FavoriteTagVO> findTagsWithCountByUserId(@Param("userId") Long userId);
}
