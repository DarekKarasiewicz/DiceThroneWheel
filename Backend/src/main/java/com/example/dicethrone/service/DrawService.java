package com.example.dicethrone.service;

import com.example.dicethrone.dto.DrawResponseDTO;
import com.example.dicethrone.mapper.CharacterMapper;
import com.example.dicethrone.mapper.DrawMapper;
import com.example.dicethrone.model.Draw;
import com.example.dicethrone.model.Character;
import com.example.dicethrone.model.Player;
import com.example.dicethrone.repository.CharacterRepository;
import com.example.dicethrone.repository.DrawRepository;
import com.example.dicethrone.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class DrawService {

    private final CharacterRepository characterRepository;
    private final DrawRepository drawRepository;
    private final PlayerRepository playerRepository;
    private final DrawMapper drawMapper;
    private final Random random = new Random();

    public DrawResponseDTO drawRandomCharacter() {
        List<Character> allCharacters = characterRepository.findAll();

        if (allCharacters.isEmpty()) {
            throw new RuntimeException("There are no characters");
        }


        Character drawnCharacter = allCharacters.get(random.nextInt(allCharacters.size()));

        Draw draw = new Draw();
        draw.setTimestamp(LocalDateTime.now());
        draw.setCharacter(drawnCharacter);

//        Draw savedDraw = drawRepository.save(draw);
        return drawMapper.toDTO(draw);
    }
    public DrawResponseDTO saveDraw (@RequestParam int playerId, int characterId) {

        Character character = characterRepository.findById(characterId).orElseThrow();
        Player player = playerRepository.findById(playerId).orElseThrow();


        Draw draw = new Draw();
        draw.setCharacter(character);
        draw.setPlayer(player);

        Draw savedDraw = drawRepository.save(draw);
        return drawMapper.toDTO(savedDraw);
    }

    public List<DrawResponseDTO> getDrawHistory() {
        return drawRepository.findAll().stream()
                .map(drawMapper::toDTO)
                .toList();
    }
}