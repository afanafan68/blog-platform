// com/example/pojo/dto/FavoriteCreateDTO.java
package com.example.pojo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteCreateDTO {
    private Long blogId;
    private String tagName;  // 收藏夹标签名，若不传则使用"默认收藏夹"
}
