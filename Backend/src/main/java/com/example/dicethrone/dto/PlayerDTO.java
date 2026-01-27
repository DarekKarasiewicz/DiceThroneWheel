package com.example.dicethrone.dto;

import com.example.dicethrone.model.Draw;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PlayerDTO {
    private int id;
    private String name;
    private List<Draw> draws;
}
