package com.danielfreitassc.backend.controlles;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.services.ServicesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/services")
public class ServicesController {
    private final ServicesService servicesService;

    @PostMapping
    public ServicesResponseDto create(@RequestBody @Valid ServicesRequestDto servicesRequestDto) {
        return servicesService.create(servicesRequestDto);
    }
}
