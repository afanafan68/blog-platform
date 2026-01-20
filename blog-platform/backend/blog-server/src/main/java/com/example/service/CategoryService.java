// com/example/service/CategoryService.java
package com.example.service;

import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.CategoryVO;
import com.example.pojo.vo.PageResultVO;

import java.util.List;

public interface CategoryService {
    List<CategoryVO> getCategoryList();
    PageResultVO<BlogListVO> getCategoryBlogs(Long categoryId, Integer page, Integer size);
}
