package com.danielfreitassc.backend.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.models.MediaEntity;
import com.danielfreitassc.backend.repositories.MediaRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class MediaHelper {
    private final MediaRepository mediaRepository;

    public List<String> getImageIdsByStepId(String stepId) {
        List<MediaEntity> media = mediaRepository.findByStep_Id(stepId);
        return media.stream().map(MediaEntity::getImageId).toList();
    }
}
