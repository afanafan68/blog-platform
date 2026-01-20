// com/example/pojo/vo/SimpleCategoryVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleCategoryVO {
    private Long id;
    private String name;
}
