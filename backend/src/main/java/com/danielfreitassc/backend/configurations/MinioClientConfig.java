package com.danielfreitassc.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.minio.MinioClient;

@Configuration
public class MinioClientConfig {
    @Bean
    MinioClient minioClient() {
        return MinioClient.builder().endpoint("http://minio:9000").credentials("ROOTUSER", "CHANGEME123").build();
    }
}
