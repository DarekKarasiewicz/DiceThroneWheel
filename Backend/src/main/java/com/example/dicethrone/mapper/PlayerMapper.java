package com.example.dicethrone.mapper;

import com.example.dicethrone.dto.DrawResponseDTO;
import com.example.dicethrone.dto.PlayerDTO;
import com.example.dicethrone.model.Player;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface PlayerMapper {

    @Mapping(source = "id", target = "id")
    PlayerDTO toDTO(Player player);
}
