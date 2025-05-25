package com.danielfreitassc.backend.dtos;

import java.time.LocalDate;
import java.util.UUID;

import com.danielfreitassc.backend.configurations.OnCreate;
import com.danielfreitassc.backend.models.StatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ServicesRequestDto(
    @NotBlank(message = "O título é necessário")
    String title,
    @NotBlank(message = "O nome do veículo é necessário")
    String vehicle,
    @NotBlank(message = "Uma descrição é necessária")
    String description,
    @NotBlank(message = "Número para contato é necessário")
    String contactNumber,
    UUID mechanicId,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate conclusionDate,
    @NotNull(groups = OnCreate.class)
    StatusEnum status
) {
    
}
