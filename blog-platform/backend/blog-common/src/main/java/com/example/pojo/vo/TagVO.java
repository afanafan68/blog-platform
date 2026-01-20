// com/example/pojo/vo/TagVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagVO {
    private Long id;
    private String name;
    private Integer blogCount;
}
