// com/example/mapper/CategoryMapper.java
package com.example.mapper;

import com.example.pojo.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CategoryMapper {
    Category findById(@Param("id") Long id);
    List<Category> findAll();
    void insert(Category category);
    void update(Category category);
    void deleteById(@Param("id") Long id);
}
