package com.danielfreitassc.backend.mappers;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

import com.danielfreitassc.backend.dtos.StepRequestDto;
import com.danielfreitassc.backend.dtos.StepResponseDto;
import com.danielfreitassc.backend.models.StepEntity;

@Mapper(componentModel = "spring")
public abstract class StepMapper {

    @Autowired
    protected MediaHelper mediaHelper;

    @Mapping(target = "serviceId", source = "service.id")
    public abstract StepResponseDto toDto(StepEntity stepEntity);

    @AfterMapping
    protected void afterToDto(StepEntity entity, @MappingTarget StepResponseDto dto) {
        dto.setImageIds(mediaHelper.getImageIdsByStepId(entity.getId()));
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "service.id", source = "serviceId")
    public abstract StepEntity toEntity(StepRequestDto stepRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "service.id", source = "serviceId")
    public abstract void toUpdate(StepRequestDto stepRequestDto, @MappingTarget StepEntity stepEntity);
}
