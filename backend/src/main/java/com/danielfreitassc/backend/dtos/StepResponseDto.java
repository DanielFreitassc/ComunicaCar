package com.danielfreitassc.backend.dtos;

import java.sql.Timestamp;
import java.util.List;

import lombok.Data;

@Data
public class StepResponseDto {
    private String id;
    private String serviceId;
    private String title;
    private String description;
    private Timestamp createdAt;

    private List<String> imageIds;
}
