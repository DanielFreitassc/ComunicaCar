package com.danielfreitassc.backend.dtos;

import java.time.LocalDate;
import java.util.List;

import com.danielfreitassc.backend.models.StatusEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class ServicePublicResponseDto {
    private String id;
    private String ticketNumber;
    private String clientName;
    private String title;
    private String vehicle;
    private String description;

    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate conclusionDate;

    private StatusEnum status;
    private List<StepResponseDto> steps;
    private String createdAt;
}
