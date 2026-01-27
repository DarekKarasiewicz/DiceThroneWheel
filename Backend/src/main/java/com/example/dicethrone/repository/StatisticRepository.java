package com.example.dicethrone.repository;

import com.example.dicethrone.model.CharacterStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatisticRepository extends JpaRepository<CharacterStatistics,Integer> {

}
