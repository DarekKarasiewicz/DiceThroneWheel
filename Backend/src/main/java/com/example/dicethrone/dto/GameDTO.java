package com.example.dicethrone.dto;

import com.example.dicethrone.model.Draw;
import com.example.dicethrone.model.GameStatus;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GameDTO {
    private int id;
    private GameStatus status;
    private int winner_id;
    private List<DrawResponseDTO> draws;
}
