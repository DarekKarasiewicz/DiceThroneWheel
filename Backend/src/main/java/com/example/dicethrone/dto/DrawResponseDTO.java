package com.example.dicethrone.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class DrawResponseDTO {
    private int id;
    private CharacterDTO character;
    private LocalDateTime timestamp;
    private String sessionId;
}
