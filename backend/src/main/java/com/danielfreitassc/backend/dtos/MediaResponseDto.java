package com.danielfreitassc.backend.dtos;

import java.sql.Timestamp;

public record MediaResponseDto(
    String id,
    String serviceId,
    String imageId,
    Timestamp createdAt
) {
    
}
