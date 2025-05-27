package com.danielfreitassc.backend.controlles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.MediaRequestDto;
import com.danielfreitassc.backend.dtos.MediaResponseDto;
import com.danielfreitassc.backend.dtos.MessageAndIdDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.services.MediaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/media")
public class MediaController {
    private final MediaService mediaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageAndIdDto create(@ModelAttribute @Valid MediaRequestDto mediaRequestDto) throws Exception {
        return mediaService.create(mediaRequestDto);
    }

    @GetMapping
    public Page<MediaResponseDto> getMedias(Pageable pageable) {
        return mediaService.getMedias(pageable);
    }

    @GetMapping("/{id}")
    public MediaResponseDto getMedia(@PathVariable String id) {
        return mediaService.getMedia(id);
    }
    @PutMapping("/{id}")
    public MessageResponseDto update(@PathVariable String id,@ModelAttribute @Valid MediaRequestDto mediaRequestDto) throws Exception {
        return mediaService.update(id, mediaRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto remove(@PathVariable String id) throws Exception {
        return mediaService.remove(id);
    }
}
