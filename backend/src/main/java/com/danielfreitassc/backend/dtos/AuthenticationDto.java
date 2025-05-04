package com.danielfreitassc.backend.dtos;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDto(
    @NotBlank(message = "Username não pode estar vazio")
    String username,
    @NotBlank(message = "Senha não pode estar vazia")
    String password
) {
    
}
