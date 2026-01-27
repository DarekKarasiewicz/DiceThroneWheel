package com.example.dicethrone.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CharacterDTO {
    private int id;
    private String name;
    private String heroImageUrl;
    private String backGroundImageUrl;
    private String description;
}
