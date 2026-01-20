// com/example/service/impl/TagServiceImpl.java
package com.example.service.impl;

import com.example.mapper.TagMapper;
import com.example.pojo.entity.Tag;
import com.example.pojo.vo.TagVO;
import com.example.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagMapper tagMapper;

    @Override
    public List<TagVO> getTagList() {
        List<Tag> tags = tagMapper.findAll();
        List<TagVO> result = new ArrayList<>();

        for (Tag tag : tags) {
            Integer blogCount = tagMapper.countBlogsByTagId(tag.getId());
            result.add(TagVO.builder()
                    .id(tag.getId())
                    .name(tag.getName())
                    .blogCount(blogCount)
                    .build());
        }

        return result;
    }

    @Override
    public List<TagVO> getHotTags() {
        return tagMapper.findHotTags(10);
    }
}
