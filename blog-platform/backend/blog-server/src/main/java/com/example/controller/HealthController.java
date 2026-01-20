package com.example.controller;

import com.example.result.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 * 用于 Docker 容器健康检查和负载均衡器健康探测
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /**
     * 健康检查端点
     * @return 健康状态信息
     */
    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("timestamp", System.currentTimeMillis());
        healthInfo.put("service", "blog-server");
        return Result.success(healthInfo);
    }

    /**
     * 就绪检查端点
     * @return 就绪状态信息
     */
    @GetMapping("/ready")
    public Result<Map<String, Object>> ready() {
        Map<String, Object> readyInfo = new HashMap<>();
        readyInfo.put("status", "READY");
        readyInfo.put("timestamp", System.currentTimeMillis());
        return Result.success(readyInfo);
    }
}
