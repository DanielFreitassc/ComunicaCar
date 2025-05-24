package com.danielfreitassc.backend.models;

public enum StatusEnum {
    READY("Pronto"),
    PROGRESS("Em progresso"),
    PENDING("Pendente");

    private final String status;

    StatusEnum(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    @Override
    public String toString() {
        return status;
    }

    public static StatusEnum fromStatus(String status) {
        for (StatusEnum s : values()) {
            if (s.status.equalsIgnoreCase(status)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Status desconhecido: " + status);
    }
}
