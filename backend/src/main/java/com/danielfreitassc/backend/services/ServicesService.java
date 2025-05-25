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
import com.danielfreitassc.backend.models.ServiceTicketSequenceEntity;
import com.danielfreitassc.backend.models.ServicesEntity;
import com.danielfreitassc.backend.models.StatusEnum;
import com.danielfreitassc.backend.models.UserEntity;
import com.danielfreitassc.backend.repositories.ServiceTicketSequenceRepository;
import com.danielfreitassc.backend.repositories.ServicesRepository;
import com.danielfreitassc.backend.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServicesService {
    private final ServicesRepository servicesRepository;
    private final ServiceTicketSequenceRepository serviceTicketSequenceRepository;
    private final ServicesMapper servicesMapper;
    private final UserRepository userRepository;

    public MessageAndIdDto create(ServicesRequestDto servicesRequestDto) {
        findMechanicOrThrow(servicesRequestDto.mechanicId());

        String ticketNumber = generateTicketNumber();
        
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


    @Transactional
    public String generateTicketNumber() {
        String year = String.valueOf(LocalDate.now().getYear());

        Optional<ServiceTicketSequenceEntity> optional = serviceTicketSequenceRepository.findById(year);

        ServiceTicketSequenceEntity sequence = optional.orElseGet(() -> {
            ServiceTicketSequenceEntity newSeq = new ServiceTicketSequenceEntity();
            newSeq.setYearKey(year);
            newSeq.setLastNumber(0);
            return newSeq;
        });

        int next = sequence.getLastNumber() + 1;
        sequence.setLastNumber(next);
        serviceTicketSequenceRepository.save(sequence);

        return String.format("%s%04d", year, next);
    }
}
