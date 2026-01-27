package com.example.dicethrone.service;

import com.example.dicethrone.dto.PlayerDTO;
import com.example.dicethrone.mapper.PlayerMapper;
import com.example.dicethrone.model.Player;
import com.example.dicethrone.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final PlayerMapper playerMapper ;

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(playerMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PlayerDTO getPlayerById(int id) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        return playerMapper.toDTO(player);
    }}
