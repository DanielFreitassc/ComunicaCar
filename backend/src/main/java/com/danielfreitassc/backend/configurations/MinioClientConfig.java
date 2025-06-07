package com.danielfreitassc.backend.configurations;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class MinioClientConfig {

    @Value("${minio.config.url}")
    private String minioUrl;
    @Value("${minio.config.username}")
    private String username;
    @Value("${minio.config.password}")
    private String password;
    @Bean
    MinioClient minioClient() {
        return MinioClient.builder().endpoint(minioUrl).credentials(username, password).build();
    }
}
