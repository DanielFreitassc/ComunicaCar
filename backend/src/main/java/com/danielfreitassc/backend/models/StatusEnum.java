package com.danielfreitassc.backend.models;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusEnum {
    READY("Pronto"),
    PROGRESS("Em progresso"),
    PENDING("Pendente");

    private final String status;

    StatusEnum(String status) {
        this.status = status;
    }

    @JsonValue
    public String getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return status;
    }

    @JsonCreator
    public static StatusEnum fromStatus(String input) {
        if (input == null) return null;

        for (StatusEnum s : values()) {
            if (s.name().equalsIgnoreCase(input)) {
                return s;
            }
        }

        for (StatusEnum s : values()) {
            if (s.status.equalsIgnoreCase(input)) {
                return s;
            }
        }

        throw new IllegalArgumentException("Status desconhecido: " + input);
    }
}
