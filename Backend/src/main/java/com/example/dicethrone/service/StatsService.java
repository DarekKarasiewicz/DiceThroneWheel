package com.example.dicethrone.service;

import com.example.dicethrone.dto.CharacterDTO;
import com.example.dicethrone.dto.PlayerStatsDTO;
import com.example.dicethrone.mapper.CharacterMapper;
import com.example.dicethrone.model.Character;
import com.example.dicethrone.model.Draw;
import com.example.dicethrone.model.Game;
import com.example.dicethrone.model.Player;
import com.example.dicethrone.repository.CharacterRepository;
import com.example.dicethrone.repository.DrawRepository;
import com.example.dicethrone.repository.GameRepository;
import com.example.dicethrone.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final PlayerRepository playerRepository;
    private final DrawRepository drawRepository;
    private final GameRepository gameRepository;
    private final CharacterRepository characterRepository;
    private final CharacterMapper characterMapper;

    @Transactional(readOnly = true)
    public List<PlayerStatsDTO> getAllPlayerStats() {
        List<Player> players = playerRepository.findAll();
        int totalHeroes = (int) characterRepository.count();
        Map<Integer, Game> gamesById = gameRepository.findAll().stream()
                .collect(Collectors.toMap(Game::getId, g -> g));

        return players.stream()
                .map(player -> buildPlayerStats(player, gamesById, totalHeroes))
                .sorted(Comparator.comparingInt(PlayerStatsDTO::getTotalWins).reversed())
                .toList();
    }

    private PlayerStatsDTO buildPlayerStats(Player player, Map<Integer, Game> gamesById, int totalHeroes) {
        List<Draw> draws = drawRepository.findByPlayerId(player.getId());

        int totalGames = draws.size();

        // Zlicz wygrane: gra ma winner_id == character_id z drawa tego gracza
        List<Draw> winningDraws = draws.stream()
                .filter(draw -> {
                    Game game = gamesById.get(draw.getGame().getId());
                    return game != null && game.getWinner_id() == draw.getCharacter().getId();
                })
                .toList();
        int totalWins = winningDraws.size();
        double winRate = totalGames > 0 ? (double) totalWins / totalGames * 100 : 0;

        // Najczęściej grana postać
        Map<Character, Long> characterPlayCount = draws.stream()
                .collect(Collectors.groupingBy(Draw::getCharacter, Collectors.counting()));

        Map.Entry<Character, Long> mostPlayed = characterPlayCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        // Postać z którą wygrywa najczęściej ("lucky character")
        Map<Character, Long> characterWinCount = winningDraws.stream()
                .collect(Collectors.groupingBy(Draw::getCharacter, Collectors.counting()));

        Map.Entry<Character, Long> luckyChar = characterWinCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .orElse(null);

        // Unikalne postacie
        int uniqueHeroes = characterPlayCount.size();
        double heroExplorationRate = totalHeroes > 0 ? (double) uniqueHeroes / totalHeroes * 100 : 0;

        // Streak (seria wygranych) — po dacie gry
        List<Draw> sortedDraws = draws.stream()
                .sorted(Comparator.comparing(Draw::getTimestamp))
                .toList();

        int currentStreak = 0;
        int longestStreak = 0;
        int tempStreak = 0;

        for (Draw draw : sortedDraws) {
            Game game = gamesById.get(draw.getGame().getId());
            boolean isWin = game != null && game.getWinner_id() == draw.getCharacter().getId();
            if (isWin) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }
        // Current streak = ile ostatnich gier z rzędu to wygrane
        for (int i = sortedDraws.size() - 1; i >= 0; i--) {
            Draw draw = sortedDraws.get(i);
            Game game = gamesById.get(draw.getGame().getId());
            boolean isWin = game != null && game.getWinner_id() == draw.getCharacter().getId();
            if (isWin) {
                currentStreak++;
            } else {
                break;
            }
        }

        double avgGamesBetweenWins = totalWins > 0 ? (double) totalGames / totalWins : 0;

        return PlayerStatsDTO.builder()
                .playerId(player.getId())
                .playerName(player.getName())
                .totalGames(totalGames)
                .totalWins(totalWins)
                .winRate(Math.round(winRate * 10.0) / 10.0)
                .mostPlayedCharacter(mostPlayed != null ? characterMapper.toDTO(mostPlayed.getKey()) : null)
                .mostPlayedCount(mostPlayed != null ? mostPlayed.getValue().intValue() : 0)
                .luckyCharacter(luckyChar != null ? characterMapper.toDTO(luckyChar.getKey()) : null)
                .luckyCharacterWins(luckyChar != null ? luckyChar.getValue().intValue() : 0)
                .uniqueHeroesPlayed(uniqueHeroes)
                .totalHeroesAvailable(totalHeroes)
                .currentWinStreak(currentStreak)
                .longestWinStreak(longestStreak)
                .avgGamesBetweenWins(Math.round(avgGamesBetweenWins * 10.0) / 10.0)
                .heroExplorationRate(Math.round(heroExplorationRate * 10.0) / 10.0)
                .build();
    }
}
