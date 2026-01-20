// com/example/mapper/FavoriteFolderMapper.java
package com.example.mapper;

import com.example.pojo.entity.FavoriteFolder;
import com.example.pojo.vo.FavoriteFolderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 收藏夹Mapper接口
 */
@Mapper
public interface FavoriteFolderMapper {
    
    /**
     * 插入收藏夹
     */
    void insert(FavoriteFolder favoriteFolder);
    
    /**
     * 根据用户ID和收藏夹名称查询
     */
    FavoriteFolder findByUserIdAndName(@Param("userId") Long userId, @Param("name") String name);
    
    /**
     * 根据用户ID获取收藏夹列表
     */
    List<FavoriteFolderVO> findByUserId(@Param("userId") Long userId);
    
    /**
     * 根据ID删除收藏夹
     */
    void deleteById(@Param("id") Long id);
    
    /**
     * 根据用户ID删除所有收藏夹
     */
    void deleteByUserId(@Param("userId") Long userId);
}
