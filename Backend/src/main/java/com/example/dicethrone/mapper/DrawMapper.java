package com.example.dicethrone.mapper;

import com.example.dicethrone.dto.DrawResponseDTO;
import com.example.dicethrone.model.Draw;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = {CharacterMapper.class})
public interface DrawMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "character", target = "character")
    DrawResponseDTO toDTO(Draw draw);
}