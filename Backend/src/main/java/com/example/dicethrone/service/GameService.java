package com.example.dicethrone.service;

import com.example.dicethrone.dto.GameDTO;
import com.example.dicethrone.mapper.GameMapper;
import com.example.dicethrone.model.Game;
import com.example.dicethrone.model.GameStatus;
import com.example.dicethrone.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GameService {
    private final GameRepository repository;
    private final GameMapper gameMapper;

    public List<GameDTO> getHistory(){
        return gameMapper.convertToDTO(repository.findAll());
    }

    public GameDTO createNewGame(){
        Game game = new Game();
        repository.save(game);
        return gameMapper.convertToDTO(game);
    }

    public GameDTO saveGame(int id, int winner_id, String gameStatus){
        Optional<Game> game = repository.findById(id);
        if(!game.isPresent()){
            return null;
            //TODO
        }
        if (winner_id != 0){
            game.get().setWinner_id(winner_id);
        }
        if (!gameStatus.isBlank()){
            game.get().setStatus(GameStatus.valueOf(gameStatus));
        }

        return gameMapper.convertToDTO(game.get());
    }


}
