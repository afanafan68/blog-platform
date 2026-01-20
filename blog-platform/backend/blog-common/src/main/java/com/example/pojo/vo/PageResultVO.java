// com/example/pojo/vo/PageResultVO.java
package com.example.pojo.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PageResultVO<T> {
    private Long total;
    private Long size;
    private Long current;
    private Long pages;
    private List<T> records;
}
