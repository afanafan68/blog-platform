// com/example/controller/FavoriteController.java
package com.example.controller;

import com.example.context.BaseContext;
import com.example.pojo.dto.FavoriteCreateDTO;
import com.example.pojo.dto.FolderCreateDTO;
import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.FavoriteFolderVO;
import com.example.pojo.vo.FavoriteTagVO;
import com.example.pojo.vo.PageResultVO;
import com.example.result.Result;
import com.example.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * 添加收藏
     * POST /api/favorites
     */
    @PostMapping
    public Result<Void> addFavorite(@RequestBody FavoriteCreateDTO createDTO) {
        Long userId = BaseContext.getCurrentId();
        favoriteService.addFavorite(userId, createDTO.getBlogId(), createDTO.getTagName());
        return Result.success("收藏成功");
    }

    /**
     * 取消收藏
     * DELETE /api/favorites/{blogId}
     */
    @DeleteMapping("/{blogId}")
    public Result<Void> removeFavorite(@PathVariable Long blogId) {
        Long userId = BaseContext.getCurrentId();
        favoriteService.removeFavorite(userId, blogId);
        return Result.success("取消收藏成功");
    }

    /**
     * 获取收藏列表
     * GET /api/favorites/list
     */
    @GetMapping("/list")
    public Result<PageResultVO<BlogListVO>> getFavoriteList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String tag) {
        Long userId = BaseContext.getCurrentId();
        PageResultVO<BlogListVO> pageResult = favoriteService.getFavoriteList(userId, tag, page, size);
        return Result.success(pageResult);
    }

    /**
     * 获取收藏标签列表
     * GET /api/favorites/tags
     */
    @GetMapping("/tags")
    public Result<List<FavoriteTagVO>> getFavoriteTags() {
        Long userId = BaseContext.getCurrentId();
        List<FavoriteTagVO> tags = favoriteService.getFavoriteTags(userId);
        return Result.success(tags);
    }

    /**
     * 检查是否已收藏
     * GET /api/favorites/check/{blogId}
     */
    @GetMapping("/check/{blogId}")
    public Result<Boolean> checkFavorite(@PathVariable Long blogId) {
        Long userId = BaseContext.getCurrentId();
        Boolean isFavorited = favoriteService.checkFavorite(userId, blogId);
        return Result.success(isFavorited);
    }

    /**
     * 创建新的收藏夹
     * POST /api/favorites/folder
     */
    @PostMapping("/folder")
    public Result<Void> createFolder(@RequestBody FolderCreateDTO createDTO) {
        Long userId = BaseContext.getCurrentId();
        favoriteService.createFolder(userId, createDTO.getFolderName());
        return Result.success();
    }

    /**
     * 获取收藏夹列表
     * GET /api/favorites/folders
     */
    @GetMapping("/folders")
    public Result<List<FavoriteFolderVO>> getFolders() {
        Long userId = BaseContext.getCurrentId();
        List<FavoriteFolderVO> folders = favoriteService.getFolders(userId);
        return Result.success(folders);
    }

    /**
     * 根据收藏夹名称获取博客列表
     * GET /api/favorites/folder/blog
     */
    @GetMapping("/folder/blog")
    public Result<PageResultVO<BlogListVO>> getBlogsByFolderName(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam("folder_name") String folderName) {
        Long userId = BaseContext.getCurrentId();
        PageResultVO<BlogListVO> pageResult = favoriteService.getBlogsByFolderName(userId, folderName, page, size);
        return Result.success(pageResult);
    }

}
