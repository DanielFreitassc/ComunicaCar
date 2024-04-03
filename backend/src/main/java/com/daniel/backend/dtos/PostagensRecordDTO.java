package com.daniel.backend.dtos;

import java.time.LocalDate;

public record PostagensRecordDTO(String titulo, String texto, LocalDate data, String foto) {
    
}
