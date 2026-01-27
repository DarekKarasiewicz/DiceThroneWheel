package com.example.dicethrone.controller;

import com.example.dicethrone.dto.DrawResponseDTO;
import com.example.dicethrone.service.DrawService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/draw")
@RequiredArgsConstructor
public class DrawController {

    private final DrawService drawService;

    @PostMapping
    public DrawResponseDTO rollCharacter() {
        return drawService.drawRandomCharacter();
    }

    @PostMapping("/save")
    public DrawResponseDTO saveCharacter(@RequestParam int playerId, @RequestParam int characterId) {
        return drawService.saveDraw(playerId, characterId);
    }

    @GetMapping("/history")
    public List<DrawResponseDTO> getHistory() {
        return drawService.getDrawHistory();
    }
}