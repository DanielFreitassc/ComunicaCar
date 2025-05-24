package com.danielfreitassc.backend.services;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.MediaRequestDto;
import com.danielfreitassc.backend.dtos.MediaResponseDto;
import com.danielfreitassc.backend.mappers.MediaMapper;
import com.danielfreitassc.backend.models.MediaEntity;
import com.danielfreitassc.backend.repositories.MediaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final MediaRepository mediaRepository;
    private final MinioService minioService;
    private final MediaMapper mediaMapper;

    public MediaResponseDto create(MediaRequestDto mediaRequestDto) throws Exception {
        String imageId = UUID.randomUUID().toString();

        MediaEntity mediaEntity = mediaMapper.toEntity(mediaRequestDto);
        mediaEntity.setImageId(imageId);
        
        minioService.upload(imageId, mediaRequestDto.image());

        return mediaMapper.toDto(mediaRepository.save(mediaEntity));
    }
}
