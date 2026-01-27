package com.example.dicethrone.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Fetch;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "draws")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Draw {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name="character_id",nullable = false)
    private Character character;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "player_id")
    private Player player;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}
