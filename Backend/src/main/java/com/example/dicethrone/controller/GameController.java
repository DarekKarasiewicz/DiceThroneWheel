package com.example.dicethrone.controller;

import com.example.dicethrone.dto.GameDTO;
import com.example.dicethrone.model.Game;
import com.example.dicethrone.repository.GameRepository;
import com.example.dicethrone.service.GameService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;

@RestController
@RequestMapping("/api/game")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping("/history")
    public List<GameDTO> getGamesHistory(){
        return gameService.getHistory();
    }

    @PostMapping("/create")
    public GameDTO createNewGame(){
        return gameService.createNewGame();
    }

    @PutExchange("/create")
    public GameDTO saveGame(@RequestParam int gameId, @RequestParam int winnerId, @RequestParam String gameStatus){
        return gameService.saveGame(gameId, winnerId, gameStatus);
    }
}

