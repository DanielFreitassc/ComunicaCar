package com.danielfreitassc.backend.controlles;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.MessageAndIdDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
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
    public MessageAndIdDto create(@RequestBody @Valid ServicesRequestDto servicesRequestDto) {
        return servicesService.create(servicesRequestDto);
    }

    @GetMapping
    public Page<ServicesResponseDto> getServices(Pageable pageable) {
        return servicesService.getServices(pageable);
    }

    @GetMapping("/{id}")
    public ServicesResponseDto getService(@PathVariable String id) {
        return servicesService.getService(id);
    }

    @PutMapping("/{id}")
    public MessageResponseDto update(@PathVariable String id,@RequestBody @Valid ServicesRequestDto servicesRequestDto) {
        return servicesService.update(id, servicesRequestDto);
    }

    @DeleteMapping("/{id}")
    public MessageResponseDto delete(@PathVariable String id) {
        return servicesService.delete(id);
    }
}
