package com.danielfreitassc.backend.dtos;

import java.sql.Timestamp;

public record MediaResponseDto(
    String id,
    ServicesResponseDto serviceId,
    String imageId,
    Timestamp createdAt
) {
    
}
