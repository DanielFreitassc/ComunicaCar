package com.danielfreitassc.backend.configurations;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<MessageResponseDto> handleResponseStatusException(ResponseStatusException ex) {
        String message = ex.getReason();
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());

        MessageResponseDto messageResponseDto = new MessageResponseDto(message);
        return new ResponseEntity<>(messageResponseDto, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponseDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
            .map(ObjectError::getDefaultMessage)
            .collect(Collectors.joining(", "));

        MessageResponseDto messageResponseDto = new MessageResponseDto(errorMessage);
        return new ResponseEntity<>(messageResponseDto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<MessageResponseDto> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException invalidFormatEx) {
            String fieldName = invalidFormatEx.getPath().stream()
                .map(ref -> ref.getFieldName())
                .collect(Collectors.joining("."));
            invalidFormatEx.getTargetType();
            String invalidValue = String.valueOf(invalidFormatEx.getValue());

            String message = String.format(
                "Valor inválido '%s' para o campo '%s'. Verifique o formato ou tipo esperado.",
                invalidValue, fieldName
            );

            return new ResponseEntity<>(new MessageResponseDto(message), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(
                new MessageResponseDto("Erro ao ler a requisição. Verifique o JSON enviado."),
                HttpStatus.BAD_REQUEST);
    }

}
