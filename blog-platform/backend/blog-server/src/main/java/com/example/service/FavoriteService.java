// com/example/service/FavoriteService.java
package com.example.service;

import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.FavoriteTagVO;
import com.example.pojo.vo.PageResultVO;

import java.util.List;

public interface FavoriteService {
    
    /**
     * 添加收藏
     * @param userId 用户ID
     * @param blogId 博客ID
     * @param tagName 收藏夹标签名（可选，若不传则使用"默认收藏夹"）
     */
    void addFavorite(Long userId, Long blogId, String tagName);
    
    /**
     * 取消收藏
     * @param userId 用户ID
     * @param blogId 博客ID
     */
    void removeFavorite(Long userId, Long blogId);
    
    /**
     * 获取收藏列表
     * @param userId 用户ID
     * @param tag 标签名称（可选）
     * @param page 页码
     * @param size 每页条数
     * @return 分页的博客列表
     */
    PageResultVO<BlogListVO> getFavoriteList(Long userId, String tag, Integer page, Integer size);
    
    /**
     * 获取用户收藏的博客所包含的标签列表及对应收藏数量
     * @param userId 用户ID
     * @return 标签列表
     */
    List<FavoriteTagVO> getFavoriteTags(Long userId);
    
    /**
     * 检查是否已收藏
     * @param userId 用户ID
     * @param blogId 博客ID
     * @return true表示已收藏，false表示未收藏
     */
    Boolean checkFavorite(Long userId, Long blogId);
    
    /**
     * 创建收藏夹
     * @param userId 用户ID
     * @param folderName 收藏夹名称
     */
    void createFolder(Long userId, String folderName);
    
    /**
     * 获取用户的收藏夹列表
     * @param userId 用户ID
     * @return 收藏夹列表
     */
    java.util.List<com.example.pojo.vo.FavoriteFolderVO> getFolders(Long userId);
    
    /**
     * 根据收藏夹名称获取博客列表
     * @param userId 用户ID
     * @param folderName 收藏夹名称
     * @param page 页码
     * @param size 每页条数
     * @return 分页的博客列表
     */
    PageResultVO<BlogListVO> getBlogsByFolderName(Long userId, String folderName, Integer page, Integer size);
}
