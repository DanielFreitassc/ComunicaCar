package com.danielfreitassc.backend.dtos;

import com.danielfreitassc.backend.models.UserRole;

public record LoginResponseDto(
    String token,
    UserRole role
) {
    
}
