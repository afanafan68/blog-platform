// com/example/pojo/vo/FavoriteTagVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteTagVO {
    private Long id;
    private String name;
    private Integer count;
}
