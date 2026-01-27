package com.example.dicethrone.service;

import com.example.dicethrone.dto.CharacterDTO;
import com.example.dicethrone.mapper.CharacterMapper;
import com.example.dicethrone.repository.CharacterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.example.dicethrone.model.Character;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CharacterService {
    private final CharacterRepository characterRepository;
    private final CharacterMapper characterMapper; // Wstrzyknięty automatycznie



    public List<CharacterDTO> getAllCharacters(){
        List<Character> characters = characterRepository.findAll();

        return characters.stream()
                .map(characterMapper::toDTO)
                .toList();
    }


    public CharacterDTO getCharacterById(int id){
        Character character = characterRepository.findById(id).orElse(null);
        if (character == null){
            return null;
        }
        return characterMapper.toDTO(character);
    }

}
