package com.danielfreitassc.backend.services;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.StepRequestDto;
import com.danielfreitassc.backend.dtos.StepResponseDto;
import com.danielfreitassc.backend.mappers.StepMapper;
import com.danielfreitassc.backend.models.ServicesEntity;
import com.danielfreitassc.backend.models.StepEntity;
import com.danielfreitassc.backend.repositories.ServicesRepository;
import com.danielfreitassc.backend.repositories.StepRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StepService {
    private final StepRepository stepRepository;
    private final ServicesRepository servicesRepository;
    private final StepMapper stepMapper;

    public StepResponseDto create(StepRequestDto stepRequestDto) {
        findServiceOrThrow(stepRequestDto.serviceId());
        return stepMapper.toDto(stepRepository.save(stepRepository.save(stepMapper.toEntity(stepRequestDto))));
    }

    public Page<StepResponseDto> getPages(Pageable pageable) {
        return stepRepository.findAll(pageable).map(stepMapper::toDto);
    }

    public StepResponseDto getStep(String id) {
        return stepMapper.toDto(findStepOrThrow(id));
    }

    public StepResponseDto update(String id, StepRequestDto stepRequestDto) {
        findServiceOrThrow(stepRequestDto.serviceId());
        StepEntity stepEntity = findStepOrThrow(id);

        stepMapper.toUpdate(stepRequestDto, stepEntity);

        return stepMapper.toDto(stepRepository.save(stepEntity));
    }

    public StepResponseDto delete(String id) {
        StepEntity stepEntity = findStepOrThrow(id);
        stepRepository.delete(stepEntity);
        return stepMapper.toDto(stepEntity);
    }

    private StepEntity findStepOrThrow(String id) {
        Optional<StepEntity> step = stepRepository.findById(id);
        if(step.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Etapa não encontrada!");
        return step.get(); 
    }

    private void findServiceOrThrow(String id) {
        Optional<ServicesEntity> services = servicesRepository.findById(id);
        if(services.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Serviço indicado não encontrado!");
    }
}
