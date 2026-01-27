package com.example.dicethrone.repository;

import com.example.dicethrone.model.Draw;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DrawRepository extends JpaRepository<Draw, Integer> {
}
