// com/example/mapper/UserMapper.java
package com.example.mapper;

import com.example.pojo.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User findById(@Param("id") Long id);
    User findByUsername(@Param("username") String username);
    void insert(User user);
    void update(User user);
    void deleteById(@Param("id") Long id);
}
