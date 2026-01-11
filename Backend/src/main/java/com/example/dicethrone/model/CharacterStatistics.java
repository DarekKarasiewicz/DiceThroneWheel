package com.example.dicethrone.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "character_statistics")
@Data
public class CharacterStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "character_id", unique = true)
    private Character character;

    private Integer totalDraws = 0;

    private LocalDateTime lastDrawn;

    private Integer totalWins = 0;

    private Integer totalLosses = 0;

    private Double winRate = 0.0;

    private Double averageGameDuration;

    private Long mostFrequentOpponentId;

    private Integer currentStreak = 0;

    private Integer longestStreak = 0;
}