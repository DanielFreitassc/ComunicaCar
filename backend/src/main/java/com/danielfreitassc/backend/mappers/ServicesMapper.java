package com.danielfreitassc.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.ServicesRequestDto;
import com.danielfreitassc.backend.dtos.ServicesResponseDto;
import com.danielfreitassc.backend.models.ServicesEntity;

@Mapper(componentModel = "spring")
public interface ServicesMapper {
    ServicesResponseDto toDto(ServicesEntity servicesEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "ticketNumber", ignore = true)
    @Mapping(target = "mechanicId.id", source = "mechanicId")
    ServicesEntity toEntity(ServicesRequestDto servicesRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "ticketNumber", ignore = true)
    @Mapping(target = "mechanicId.id", source = "mechanicId")
    void toUpdate(ServicesRequestDto servicesRequestDto, @MappingTarget ServicesEntity servicesEntity);
}
