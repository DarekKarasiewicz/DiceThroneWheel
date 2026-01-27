package com.example.dicethrone.controller;

import com.example.dicethrone.dto.CharacterDTO;
import com.example.dicethrone.model.Character;
import com.example.dicethrone.service.CharacterService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/characters")
@RequiredArgsConstructor
public class CharacterController {
    private final CharacterService characterService;

    @GetMapping
    public ResponseEntity<List<CharacterDTO>> getCharacters() {
        List<CharacterDTO> characters = characterService.getAllCharacters();
        return ResponseEntity.ok(characters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CharacterDTO> getCharacterById(@RequestParam("id") Integer id) {
        CharacterDTO character = characterService.getCharacterById(id);
        return ResponseEntity.ok(character);
    }

}
