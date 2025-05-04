package com.danielfreitassc.backend.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

import com.danielfreitassc.backend.models.UserRole;
import com.fasterxml.jackson.annotation.JsonFormat;

public record UserResponseDto(
    UUID id,
    String name,
    String username,
    UserRole role,
    @JsonFormat(pattern = "dd/MM/yyyy")
    LocalDateTime createdAt
) {
    
}
