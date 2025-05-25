package com.danielfreitassc.backend.services;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.danielfreitassc.backend.dtos.MessageAndIdDto;
import com.danielfreitassc.backend.dtos.MessageResponseDto;
import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.mappers.ServicesMapper;
import com.danielfreitassc.backend.models.ServicesEntity;
import com.danielfreitassc.backend.models.StatusEnum;
import com.danielfreitassc.backend.models.UserEntity;
import com.danielfreitassc.backend.repositories.ServicesRepository;
import com.danielfreitassc.backend.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicesService {
    private final ServicesRepository servicesRepository;
    private final ServicesMapper servicesMapper;
    private final UserRepository userRepository;

    public MessageAndIdDto create(ServicesRequestDto servicesRequestDto) {
        findMechanicOrThrow(servicesRequestDto.mechanicId());
        String year = String.valueOf(LocalDate.now().getYear());

        long count = servicesRepository.countByTicketNumberStartingWith(year);
        String ticketNumber = String.format("%s%04d", year, count + 1);
        
        ServicesEntity servicesEntity = servicesMapper.toEntity(servicesRequestDto);
        servicesEntity.setTicketNumber(ticketNumber);
        servicesEntity.setStatus(StatusEnum.PENDING);
        servicesRepository.save(servicesEntity);
        return new MessageAndIdDto("Ordem de serviço cadastrada com sucesso", servicesEntity.getId());
    }

    public Page<ServicesResponseDto> getServices(Pageable pageable) {
        return servicesRepository.findAll(pageable).map(servicesMapper::toDto);
    }

    public ServicesResponseDto getService(String id) {
        return servicesMapper.toDto(findServicesOrThrow(id));
    }   

    public MessageResponseDto delete(String id) {
        ServicesEntity servicesEntity = findServicesOrThrow(id);
        servicesRepository.delete(servicesEntity);
        return new MessageResponseDto("Ordem de serviço removida com sucesso");
    }

    public MessageResponseDto update(String id, ServicesRequestDto servicesRequestDto) {
        findMechanicOrThrow(servicesRequestDto.mechanicId());
        ServicesEntity servicesEntity = findServicesOrThrow(id);

        servicesMapper.toUpdate(servicesRequestDto, servicesEntity);

        servicesRepository.save(servicesEntity);
        
        return new MessageResponseDto("Ordem de serviço atualizada com sucesso");
    }

    private void findMechanicOrThrow(UUID id) {
        Optional<UserEntity> user = userRepository.findById(id);
        if(user.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Mecânico indicado não encontrado");
    }

    private ServicesEntity findServicesOrThrow(String id) {
        Optional<ServicesEntity> services = servicesRepository.findById(id);
        if(services.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Ordem de serviço não encontrada");
        return services.get();
    }

}
