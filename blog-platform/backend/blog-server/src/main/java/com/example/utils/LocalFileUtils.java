package com.example.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

/**
 * 本地文件存储工具类
 * 用于将文件保存到本地文件系统
 */
@Component
public class LocalFileUtils {

    @Value("${app.upload.path:./uploads}")
    private String uploadPath;

    @Value("${app.upload.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * 上传文件到本地
     *
     * @param file 要上传的文件
     * @return 文件的访问 URL
     * @throws IOException 上传异常
     */
    public String upload(MultipartFile file) throws IOException {
        return upload(file, "common");
    }

    /**
     * 上传文件到本地指定子目录
     *
     * @param file      要上传的文件
     * @param subFolder 子目录名称（如 avatar, cover 等）
     * @return 文件的访问 URL
     * @throws IOException 上传异常
     */
    public String upload(MultipartFile file, String subFolder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("上传文件不能为空");
        }

        // 获取原始文件名
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("文件名不能为空");
        }

        // 获取文件扩展名
        String extension = "";
        int lastDotIndex = originalFilename.lastIndexOf(".");
        if (lastDotIndex > 0) {
            extension = originalFilename.substring(lastDotIndex);
        }

        // 生成唯一文件名
        String fileName = UUID.randomUUID().toString() + extension;

        // 创建目标目录 - 确保使用绝对路径
        Path targetDir = Paths.get(uploadPath, subFolder).toAbsolutePath().normalize();
        if (!Files.exists(targetDir)) {
            Files.createDirectories(targetDir);
        }

        // 保存文件 - 使用绝对路径
        Path targetPath = targetDir.resolve(fileName);
        file.transferTo(targetPath.toFile());

        // 返回访问 URL
        String url = baseUrl + "/uploads/" + subFolder + "/" + fileName;
        return url;
    }

    /**
     * 上传头像文件
     *
     * @param file 头像文件
     * @return 文件的访问 URL
     * @throws IOException 上传异常
     */
    public String uploadAvatar(MultipartFile file) throws IOException {
        return upload(file, "avatar");
    }

    /**
     * 上传博客封面图片
     *
     * @param file 封面图片文件
     * @return 文件的访问 URL
     * @throws IOException 上传异常
     */
    public String uploadCover(MultipartFile file) throws IOException {
        return upload(file, "cover");
    }

    /**
     * 删除本地文件
     *
     * @param fileUrl 文件的访问 URL
     * @return 是否删除成功
     */
    public boolean deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return false;
        }

        try {
            // 从 URL 提取相对路径
            String relativePath = fileUrl.replace(baseUrl + "/uploads/", "");
            Path filePath = Paths.get(uploadPath, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                return true;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }
}
