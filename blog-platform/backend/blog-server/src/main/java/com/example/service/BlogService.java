// com/example/service/BlogService.java
package com.example.service;

import com.example.pojo.dto.BlogCreateDTO;
import com.example.pojo.dto.BlogQueryDTO;
import com.example.pojo.dto.BlogUpdateDTO;
import com.example.pojo.vo.BlogDetailVO;
import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.PageResultVO;

public interface BlogService {
    PageResultVO<BlogListVO> getBlogList(BlogQueryDTO queryDTO);
    BlogDetailVO getBlogDetail(Long id);
    Long createBlog(Long userId, BlogCreateDTO createDTO);
    void updateBlog(Long id, Long userId, BlogUpdateDTO updateDTO);
    void deleteBlog(Long id, Long userId);
    PageResultVO<BlogListVO> searchBlog(String keyword, Integer page, Integer size, Long categoryId);
    PageResultVO<BlogListVO> getUserBlogs(Long userId, Integer page, Integer size, Integer status);
    void toggleLike(Long blogId, Long userId);
}
