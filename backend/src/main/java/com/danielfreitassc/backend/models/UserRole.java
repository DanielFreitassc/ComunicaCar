package com.danielfreitassc.backend.models;

public enum UserRole {
    ADMIN("Admin"),
    EMPLOYEE_MECHANIC("Mecânico"),
    EMPLOYEE_SECRETARY("Secretário");

    private String role;

    UserRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }
}
