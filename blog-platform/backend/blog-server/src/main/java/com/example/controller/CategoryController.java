// com/example/controller/CategoryController.java
package com.example.controller;

import com.example.pojo.vo.BlogListVO;
import com.example.pojo.vo.CategoryVO;
import com.example.pojo.vo.PageResultVO;
import com.example.result.Result;
import com.example.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public Result<List<CategoryVO>> getCategoryList() {
        List<CategoryVO> categories = categoryService.getCategoryList();
        return Result.success(categories);
    }

    @GetMapping("/{id}/blogs")
    public Result<PageResultVO<BlogListVO>> getCategoryBlogs(@PathVariable Long id,
                                                             @RequestParam(defaultValue = "1") Integer page,
                                                             @RequestParam(defaultValue = "10") Integer size) {
        PageResultVO<BlogListVO> pageResult = categoryService.getCategoryBlogs(id, page, size);
        return Result.success(pageResult);
    }
}
