// com/example/pojo/dto/FolderCreateDTO.java
package com.example.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 创建收藏夹请求DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FolderCreateDTO {
    /**
     * 收藏夹名称
     */
    private String folderName;
}
