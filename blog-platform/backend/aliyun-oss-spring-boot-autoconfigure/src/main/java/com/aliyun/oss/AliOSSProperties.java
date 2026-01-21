package com.aliyun.oss;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 阿里云 OSS 配置属性
 */
@ConfigurationProperties(prefix = "aliyun.oss")
public class AliOSSProperties {
    
    /**
     * OSS 服务端点
     */
    private String endpoint;
    
    /**
     * 访问密钥 ID
     */
    private String accessKeyId;
    
    /**
     * 访问密钥密码
     */
    private String accessKeySecret;
    
    /**
     * 存储桶名称
     */
    private String bucketName;
    
    /**
     * 区域
     */
    private String region;

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAccessKeyId() {
        return accessKeyId;
    }

    public void setAccessKeyId(String accessKeyId) {
        this.accessKeyId = accessKeyId;
    }

    public String getAccessKeySecret() {
        return accessKeySecret;
    }

    public void setAccessKeySecret(String accessKeySecret) {
        this.accessKeySecret = accessKeySecret;
    }

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
