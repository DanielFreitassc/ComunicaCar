package com.danielfreitassc.backend.infra.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.dtos.ErrorResponseDto;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public CustomAccessDeniedHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        response.resetBuffer();
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");

        ErrorResponseDto error = new ErrorResponseDto("Acesso negado");
        objectMapper.writeValue(response.getWriter(), error);
        response.flushBuffer();
    }
}