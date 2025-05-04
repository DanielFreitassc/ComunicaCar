package com.danielfreitassc.backend.dtos;

import org.hibernate.validator.constraints.Length;

import com.danielfreitassc.backend.configurations.OnCreate;
import com.danielfreitassc.backend.models.UserRole;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record UserRequestDto(
    @NotBlank(groups = OnCreate.class, message = "Nome não pode ser um campo em branco.") 
    String name,

    @NotBlank(groups = OnCreate.class, message = "Username não pode ser um campo em branco") 
    String username,
    

    @Length(groups = OnCreate.class, min = 10, message = "A senha deve ter pelo menos 10 caracteres.")
    @Pattern(groups = OnCreate.class, regexp = "^(?=.*[a-z])(?=.*[A-Z]).*$", message = "A senha deve conter ao menos uma letra maiúscula e uma letra minúscula.")  
    @NotBlank(groups = OnCreate.class, message = "Senha não pode ser um campo em branco") 
    String password,

    @NotNull(groups = OnCreate.class, message = "Cargo de segurança não pode ser um campo em branco")
    UserRole role
) {
    
}