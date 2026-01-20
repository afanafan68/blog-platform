// com/example/controller/BlogController.java
package com.example.controller;

import com.example.context.BaseContext;
import com.example.pojo.dto.BlogCreateDTO;
import com.example.pojo.dto.BlogQueryDTO;
import com.example.pojo.dto.BlogUpdateDTO;
import com.example.pojo.vo.BlogDetailVO;
import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.PageResultVO;
import com.example.result.Result;
import com.example.service.BlogService;
import com.aliyun.oss.AliOSSUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;
    
    @Autowired
    private AliOSSUtils aliOSSUtils;

    @GetMapping("/list")
    public Result<PageResultVO<BlogListVO>> getBlogList(BlogQueryDTO queryDTO) {
        PageResultVO<BlogListVO> pageResult = blogService.getBlogList(queryDTO);
        return Result.success(pageResult);
    }

    @GetMapping("/{id}")
    public Result<BlogDetailVO> getBlogDetail(@PathVariable Long id) {
        BlogDetailVO blogDetail = blogService.getBlogDetail(id);
        return Result.success(blogDetail);
    }

    @PostMapping
    public Result<Long> createBlog(@RequestBody BlogCreateDTO createDTO) {
        Long userId = BaseContext.getCurrentId();
        Long blogId = blogService.createBlog(userId, createDTO);
        return Result.success(blogId, "发表成功");
    }

    @PutMapping("/{id}")
    public Result<Void> updateBlog(@PathVariable Long id, @RequestBody BlogUpdateDTO updateDTO) {
        Long userId = BaseContext.getCurrentId();
        blogService.updateBlog(id, userId, updateDTO);
        return Result.success("更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<Void> deleteBlog(@PathVariable Long id) {
        Long userId = BaseContext.getCurrentId();
        blogService.deleteBlog(id, userId);
        return Result.success("删除成功");
    }

    @GetMapping("/search")
    public Result<PageResultVO<BlogListVO>> searchBlog(@RequestParam String keyword,
                                                       @RequestParam(defaultValue = "1") Integer page,
                                                       @RequestParam(defaultValue = "10") Integer size,
                                                       @RequestParam(required = false) Long categoryId) {
        PageResultVO<BlogListVO> pageResult = blogService.searchBlog(keyword, page, size, categoryId);
        return Result.success(pageResult);
    }

    @GetMapping("/user/{userId}")
    public Result<PageResultVO<BlogListVO>> getUserBlogs(@PathVariable Long userId,
                                                         @RequestParam(defaultValue = "1") Integer page,
                                                         @RequestParam(defaultValue = "10") Integer size,
                                                         @RequestParam(required = false) Integer status) {
        PageResultVO<BlogListVO> pageResult = blogService.getUserBlogs(userId, page, size, status);
        return Result.success(pageResult);
    }

    @PostMapping("/{id}/like")
    public Result<Void> likeBlog(@PathVariable Long id, HttpServletRequest request) {
        Long userId = BaseContext.getCurrentId();
        blogService.toggleLike(id, userId);
        return Result.success();
    }

    /**
     * 上传博客封面图片
     * POST /api/blog/cover
     */
    @PostMapping("/cover")
    public Result<String> uploadCover(MultipartFile file) throws Exception {
        String coverUrl = aliOSSUtils.upload(file);
        return Result.success(coverUrl, "上传成功");
    }
}
