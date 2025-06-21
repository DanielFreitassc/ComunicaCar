package com.danielfreitassc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record StepRequestDto(
    @NotBlank(message = "Título da etapa é necessário!")
    String title,
    @NotBlank(message = "Indicar um serviço é necessário!")
    String serviceId,
    @NotBlank(message = "Descrição da etapa é necesáario!")
    String description
) {
    
}
