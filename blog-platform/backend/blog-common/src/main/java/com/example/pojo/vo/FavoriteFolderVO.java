// com/example/pojo/vo/FavoriteFolderVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 收藏夹VO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteFolderVO {
    /**
     * 收藏夹ID
     */
    private Long id;
    
    /**
     * 收藏夹名称
     */
    private String folderName;
}
