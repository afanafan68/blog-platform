// com/example/controller/TagController.java
package com.example.controller;

import com.example.pojo.vo.TagVO;
import com.example.result.Result;
import com.example.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping("/list")
    public Result<List<TagVO>> getTagList() {
        List<TagVO> tags = tagService.getTagList();
        return Result.success(tags);
    }

    @GetMapping("/hot")
    public Result<List<TagVO>> getHotTags() {
        List<TagVO> hotTags = tagService.getHotTags();
        return Result.success(hotTags);
    }
}
