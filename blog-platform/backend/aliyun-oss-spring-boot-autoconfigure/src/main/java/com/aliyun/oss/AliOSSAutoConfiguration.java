package com.aliyun.oss;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云 OSS 自动配置类
 */
@Configuration
@EnableConfigurationProperties(AliOSSProperties.class)
public class AliOSSAutoConfiguration {

    /**
     * 创建 AliOSSUtils Bean
     * 
     * @param aliOSSProperties OSS 配置属性
     * @return AliOSSUtils 实例
     */
    @Bean
    public AliOSSUtils aliOSSUtils(AliOSSProperties aliOSSProperties) {
        AliOSSUtils aliOSSUtils = new AliOSSUtils();
        aliOSSUtils.setAliOSSProperties(aliOSSProperties);
        return aliOSSUtils;
    }
}
