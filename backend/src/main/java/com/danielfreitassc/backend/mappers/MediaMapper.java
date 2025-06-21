package com.danielfreitassc.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.MediaRequestDto;
import com.danielfreitassc.backend.dtos.MediaResponseDto;
import com.danielfreitassc.backend.models.MediaEntity;

@Mapper(componentModel = "spring")
public interface MediaMapper {
    @Mapping(target = "stepId", source = "step.id")
    MediaResponseDto toDto(MediaEntity mediaEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "step.id", source = "stepId")
    MediaEntity toEntity(MediaRequestDto mediaRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "imageId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "step.id", source = "stepId")
    void toUpdate(MediaRequestDto mediaRequestDto, @MappingTarget MediaEntity mediaEntity);
}
