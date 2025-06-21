package com.danielfreitassc.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public record MediaRequestDto(
    @NotBlank(message = "Insira a qual passo pertence a foto")
    String stepId,
    MultipartFile image
) {
    
}
