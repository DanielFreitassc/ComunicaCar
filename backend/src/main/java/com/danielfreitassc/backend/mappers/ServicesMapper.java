package com.danielfreitassc.backend.mappers;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.danielfreitassc.backend.dtos.ServicePublicResponseDto;
import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.models.ServicesEntity;

@Mapper(componentModel = "spring")
public abstract class ServicesMapper {

    @Autowired
    protected StepHelper stepHelper;

    @Autowired
    protected UserMapper userMapper;

    public abstract ServicePublicResponseDto toPulic(ServicesEntity servicesEntity);

    @AfterMapping
    protected void afterToPublicDto(ServicesEntity entity, @MappingTarget ServicePublicResponseDto dto) {
        dto.setSteps(stepHelper.getStepsByServiceId(entity.getId()));
    }

    public abstract ServicesResponseDto toDto(ServicesEntity servicesEntity);

    @AfterMapping
    protected void afterToDtoSteps(ServicesEntity entity, @MappingTarget ServicesResponseDto dto) {
        dto.setSteps(stepHelper.getStepsByServiceId(entity.getId()));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "ticketNumber", ignore = true)
    @Mapping(target = "mechanicId.id", source = "mechanicId")
    public abstract ServicesEntity toEntity(ServicesRequestDto servicesRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "ticketNumber", ignore = true)
    @Mapping(target = "mechanicId.id", source = "mechanicId")
    public abstract void toUpdate(ServicesRequestDto servicesRequestDto, @MappingTarget ServicesEntity servicesEntity);
}
