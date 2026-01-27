package com.example.dicethrone.mapper;


import com.example.dicethrone.dto.CharacterDTO;
import com.example.dicethrone.model.Character;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CharacterMapper {

    CharacterDTO toDTO(Character character);

    Character toEntity(CharacterDTO characterDTO);
}
