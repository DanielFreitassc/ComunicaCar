package com.danielfreitassc.backend.dtos;

import java.time.LocalDate;

import com.danielfreitassc.backend.models.StatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

public record ServicesRequestDto(
    String title,
    String vehicle,
    String description,
    String contactNumber,
    String mechanicId,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate conclusionDate,
    StatusEnum status
) {
    
}
