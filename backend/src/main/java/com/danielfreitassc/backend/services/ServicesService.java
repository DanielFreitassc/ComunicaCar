package com.danielfreitassc.backend.services;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.mappers.ServicesMapper;
import com.danielfreitassc.backend.models.ServicesEntity;
import com.danielfreitassc.backend.repositories.ServicesRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicesService {
    private final ServicesRepository servicesRepository;
    private final ServicesMapper servicesMapper;

    public ServicesResponseDto create(ServicesRequestDto servicesRequestDto) {
        String year = String.valueOf(LocalDate.now().getYear());

        long count = servicesRepository.countByTicketNumberStartingWith(year);
        String ticketNumber = String.format("%s%04d", year, count + 1);
        
        ServicesEntity servicesEntity = servicesRepository.save(servicesMapper.toEntity(servicesRequestDto));
        servicesEntity.setTicketNumber(ticketNumber);

        return servicesMapper.toDto(servicesEntity);
    }

}
