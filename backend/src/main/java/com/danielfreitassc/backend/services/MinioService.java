package com.danielfreitassc.backend.services;

import java.io.InputStream;

import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MinioService {
    private final MinioClient minioClient;
    private final Tika tika;

    public void upload(String imageId, MultipartFile image) throws Exception {
        validateImage(image);
        minioClient.putObject(
            PutObjectArgs.builder()
                .bucket("images")  
                .object(imageId)
                .stream(image.getInputStream(), image.getSize(), -1)
                .build()
        );
    }

    public void remove(String imageId) throws Exception {
        minioClient.removeObject(
            RemoveObjectArgs.builder()
            .bucket("images")
            .object(imageId)
            .build()
        );
    }

    private void validateImage(MultipartFile image) throws Exception {
        if(image.getInputStream() == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Imagem é obrigatória");

        try(InputStream inputStream = image.getInputStream()) {
            String mimeType = tika.detect(inputStream);

            if(!mimeType.startsWith("image/")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Apenas imagens");
        } catch (Exception e) {
            if(e instanceof ResponseStatusException) {
                throw e;
            }

            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Impossivel tratar está imagem");
        }
    }

}
