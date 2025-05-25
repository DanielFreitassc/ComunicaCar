package com.danielfreitassc.backend.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.models.MediaEntity;
import com.danielfreitassc.backend.repositories.MediaRepository;

@Component
public class MediaHelper {

    private final MediaRepository mediaRepository;

    public MediaHelper(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public List<String> getImageIdsByServiceId(String serviceId) {
        List<MediaEntity> media = mediaRepository.findByServiceId_Id(serviceId);
        return media.stream().map(MediaEntity::getImageId).toList();
    }
}
