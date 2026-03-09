package com.example.dicethrone.repository;

import com.example.dicethrone.model.Character;
import com.example.dicethrone.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameRepository extends JpaRepository<Game, Integer> {

}
