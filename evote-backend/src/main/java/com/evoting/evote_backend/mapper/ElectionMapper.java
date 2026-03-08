package com.evoting.evote_backend.mapper;

import com.evoting.evote_backend.dto.ElectionRequestDTO;
import com.evoting.evote_backend.dto.ElectionResponseDTO;
import com.evoting.evote_backend.dto.OptionDTO;
import com.evoting.evote_backend.entity.Election;
import com.evoting.evote_backend.entity.Option;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ElectionMapper {
    ElectionResponseDTO toDto(Election election);
    List<ElectionResponseDTO> toDtoList(List<Election> elections);
    OptionDTO toDto(Option option);
    Election toEntity(ElectionRequestDTO electionRequestDTO);
}
