package com.example.dicethrone.mapper;

import com.example.dicethrone.dto.GameDTO;
import com.example.dicethrone.model.Game;
import org.mapstruct.Mapper;

import java.util.List;


@Mapper(componentModel = "spring", uses = {GameMapper.class})
public interface GameMapper {
    GameDTO convertToDTO(Game game);
    List<GameDTO> convertToDTO(List<Game> game);

}
