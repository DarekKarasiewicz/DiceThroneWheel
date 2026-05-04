package com.example.dicethrone.service;

import com.example.dicethrone.dto.GameDTO;
import com.example.dicethrone.mapper.GameMapper;
import com.example.dicethrone.model.Game;
import com.example.dicethrone.model.GameStatus;
import com.example.dicethrone.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

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

    @Transactional
    public GameDTO saveGame(int id, int winner_id, String gameStatus){
        Game game = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found: " + id));
        if (winner_id != 0){
            game.setWinner_id(winner_id);
        }
        if (!gameStatus.isBlank()){
            try {
                game.setStatus(GameStatus.valueOf(gameStatus.toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid game status: " + gameStatus);
            }
        }

        repository.save(game);
        return gameMapper.convertToDTO(game);
    }


}
