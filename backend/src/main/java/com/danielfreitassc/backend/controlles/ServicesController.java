package com.danielfreitassc.backend.controlles;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.danielfreitassc.backend.dtos.MessageAndIdDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.dtos.ServicePublicResponseDto;
import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.models.StatusEnum;
import com.danielfreitassc.backend.services.ServicesService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/services")
public class ServicesController {
    private final ServicesService servicesService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MessageAndIdDto create(@RequestBody @Valid ServicesRequestDto servicesRequestDto) {
        return servicesService.create(servicesRequestDto);
    }

    @GetMapping
    public Page<ServicesResponseDto> getServices(Pageable pageable,@RequestParam(required = false) String status, @RequestParam(required = true) String id) {
        return servicesService.getServices(pageable,status, id);
    }

    @GetMapping("/{id}")
    public ServicesResponseDto getService(@PathVariable String id) {
        return servicesService.getService(id);
    }

    @GetMapping("/public/{id}")
    public ServicePublicResponseDto getPublicService(@PathVariable String id) {
        return servicesService.getPublicService(id);
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
