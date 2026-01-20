// com/example/service/TagService.java
package com.example.service;

import com.example.pojo.vo.TagVO;

import java.util.List;

public interface TagService {
    List<TagVO> getTagList();
    List<TagVO> getHotTags();
}
