package com.danielfreitassc.backend.dtos;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;

public record MediaRequestDto(
    @NotBlank(message = "Inciar um ordem de serviço é necessário")
    String serviceId,
    MultipartFile image
) {
    
}
