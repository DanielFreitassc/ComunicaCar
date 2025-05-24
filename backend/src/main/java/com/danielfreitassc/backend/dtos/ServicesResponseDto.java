package com.danielfreitassc.backend.dtos;

import java.time.LocalDate;
import java.util.List;

import com.danielfreitassc.backend.models.StatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

public record ServicesResponseDto(
    String id,
    String title,
    String vehicle,
    String description,
    String contactNumber,
    UserResponseDto mechanicId,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDate conclusionDate,
    StatusEnum status,

    //Decidir depois
    List<String> mediaIds,
    String createdAt
) {
    
}
