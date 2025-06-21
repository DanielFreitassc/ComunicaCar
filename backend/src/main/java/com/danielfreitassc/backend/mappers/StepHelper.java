package com.danielfreitassc.backend.mappers;

import java.util.List;

import org.springframework.stereotype.Component;

import com.danielfreitassc.backend.dtos.StepResponseDto;
import com.danielfreitassc.backend.repositories.StepRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class StepHelper {

    private final StepRepository stepRepository;
    private final StepMapper stepMapper;

    public List<StepResponseDto> getStepsByServiceId(String serviceId) {
        return stepRepository.findByService_Id(serviceId)
                .stream()
                .map(stepMapper::toDto)
                .toList();
    }
}


