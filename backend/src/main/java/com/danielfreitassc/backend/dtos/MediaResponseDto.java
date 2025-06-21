package com.danielfreitassc.backend.dtos;

import java.sql.Timestamp;

public record MediaResponseDto(
    String id,
    String stepId,
    String imageId,
    Timestamp createdAt
) {
    
}
