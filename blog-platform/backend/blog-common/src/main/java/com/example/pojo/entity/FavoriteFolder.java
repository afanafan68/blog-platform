// com/example/pojo/entity/FavoriteFolder.java
package com.example.pojo.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 收藏夹实体类
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteFolder {
    /**
     * 收藏夹ID
     */
    private Long id;
    
    /**
     * 收藏夹名称，对应favorite表的tag_name
     */
    private String name;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
