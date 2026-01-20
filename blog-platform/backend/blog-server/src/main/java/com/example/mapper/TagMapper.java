// com/example/mapper/TagMapper.java
package com.example.mapper;

import com.example.pojo.entity.Tag;
import com.example.pojo.vo.SimpleTagVO;
import com.example.pojo.vo.TagVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TagMapper {
    Tag findById(@Param("id") Long id);
    Tag findByName(@Param("name") String name);
    List<Tag> findAll();
    List<SimpleTagVO> findTagsByBlogId(@Param("blogId") Long blogId);
    Integer countBlogsByTagId(@Param("tagId") Long tagId);
    List<TagVO> findHotTags(@Param("limit") Integer limit);
    void insert(Tag tag);
    void update(Tag tag);
    void deleteById(@Param("id") Long id);
}
