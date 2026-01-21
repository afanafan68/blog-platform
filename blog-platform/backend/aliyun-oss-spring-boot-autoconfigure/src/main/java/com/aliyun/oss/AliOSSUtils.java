package com.aliyun.oss;

import com.aliyun.oss.common.auth.CredentialsProviderFactory;
import com.aliyun.oss.common.auth.EnvironmentVariableCredentialsProvider;
import com.aliyun.oss.common.auth.DefaultCredentialProvider;
import com.aliyun.oss.common.comm.SignVersion;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

/**
 * 阿里云 OSS 工具类
 */
public class AliOSSUtils {

    private AliOSSProperties aliOSSProperties;

    /**
     * 上传文件到阿里云 OSS
     * 
     * @param file 要上传的文件
     * @return 文件的 URL 地址
     * @throws Exception 上传异常
     */
    public String upload(MultipartFile file) throws Exception {
        String endpoint = aliOSSProperties.getEndpoint();
        String accessKeyId = aliOSSProperties.getAccessKeyId();
        String accessKeySecret = aliOSSProperties.getAccessKeySecret();
        String bucketName = aliOSSProperties.getBucketName();
        String region = aliOSSProperties.getRegion();

        InputStream inputStream = file.getInputStream();
        String originalFilename = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + originalFilename.substring(originalFilename.lastIndexOf("."));

        // 创建 OSSClient 实例
        ClientBuilderConfiguration clientBuilderConfiguration = new ClientBuilderConfiguration();
        clientBuilderConfiguration.setSignatureVersion(SignVersion.V4);
        
        OSS ossClient = OSSClientBuilder.create()
                .endpoint(endpoint)
                .credentialsProvider(new DefaultCredentialProvider(accessKeyId, accessKeySecret))
                .clientConfiguration(clientBuilderConfiguration)
                .region(region)
                .build();
        
        try {
            ossClient.putObject(bucketName, fileName, inputStream);
            String url = "https://" + bucketName + ".oss-" + region + ".aliyuncs.com/" + fileName;
            return url;
        } finally {
            // 关闭 OSSClient
            ossClient.shutdown();
        }
    }

    public AliOSSProperties getAliOSSProperties() {
        return aliOSSProperties;
    }

    public void setAliOSSProperties(AliOSSProperties aliOSSProperties) {
        this.aliOSSProperties = aliOSSProperties;
    }
}
