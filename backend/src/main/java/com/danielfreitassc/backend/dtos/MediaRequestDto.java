package com.danielfreitassc.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

public record MediaRequestDto(
    String serviceId,
    MultipartFile image
) {
    
}
