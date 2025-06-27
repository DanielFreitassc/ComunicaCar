package com.danielfreitassc.backend.dtos;

import com.danielfreitassc.backend.models.UserRole;

public record InfoResponseDto(
    String name,
    UserRole role
) {
    
}
