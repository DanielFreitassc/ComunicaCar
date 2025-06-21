package com.danielfreitassc.backend.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.MediaRequestDto;
import com.danielfreitassc.backend.dtos.MediaResponseDto;
import com.danielfreitassc.backend.dtos.MessageAndIdDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.mappers.MediaMapper;
import com.danielfreitassc.backend.models.MediaEntity;
import com.danielfreitassc.backend.models.StepEntity;
import com.danielfreitassc.backend.repositories.MediaRepository;
import com.danielfreitassc.backend.repositories.StepRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final MediaRepository mediaRepository;
    private final StepRepository stepRepository;
    private final MinioService minioService;
    private final MediaMapper mediaMapper;

    public MessageAndIdDto create(MediaRequestDto mediaRequestDto) throws Exception {
        findStepOrThrow(mediaRequestDto.stepId());

        String imageId = UUID.randomUUID().toString();

        MediaEntity mediaEntity = mediaMapper.toEntity(mediaRequestDto);
        mediaEntity.setImageId(imageId);
        
        minioService.upload(imageId, mediaRequestDto.image());
        mediaRepository.save(mediaEntity);
        return new MessageAndIdDto("Imagem salva com sucesso",mediaEntity.getId());
    }
    
    public Page<MediaResponseDto> getMedias(Pageable pageable) {
        return mediaRepository.findAll(pageable).map(mediaMapper::toDto);
    }

    public MediaResponseDto getMedia(String id) {
        return mediaMapper.toDto(findMediaOrThrow(id));
    }

    public MessageResponseDto remove(String id) throws Exception {
        MediaEntity mediaEntity = findMediaOrThrow(id);
        minioService.remove(mediaEntity.getImageId());
        mediaRepository.delete(mediaEntity);
        return new MessageResponseDto("Imagem removida com sucesso");
    }

    public MessageResponseDto update(String id, MediaRequestDto mediaRequestDto) throws Exception {
        
        MediaEntity mediaEntity = findMediaOrThrow(id);
        findStepOrThrow(mediaRequestDto.stepId());
        
        String imageId = UUID.randomUUID().toString();
        minioService.update(mediaEntity.getImageId(), imageId, mediaRequestDto.image());
        mediaEntity.setImageId(imageId);

        mediaMapper.toUpdate(mediaRequestDto, mediaEntity);
        mediaRepository.save(mediaEntity);

        return new MessageResponseDto("Imagem atualizada com sucesso");
    }

    
    private MediaEntity findMediaOrThrow(String id) {
        Optional<MediaEntity> media = mediaRepository.findById(id);
        if(media.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Nenhuma imagem encontrada");
        return media.get();
    }

    private void findStepOrThrow(String id) {
        Optional<StepEntity> services = stepRepository.findById(id);
        if(services.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Etapa indicada não encontrada!");
    }   
}
