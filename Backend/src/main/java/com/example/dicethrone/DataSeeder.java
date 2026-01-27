package com.example.dicethrone;

import com.example.dicethrone.model.Character;
import com.example.dicethrone.model.Player;
import com.example.dicethrone.repository.CharacterRepository;
import com.example.dicethrone.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CharacterRepository characterRepository;
    private final PlayerRepository playerRepository;

    @Override
    public void run(String... args) throws Exception {

        // Sprawdź czy już są postacie (żeby nie dodawać przy każdym starcie)
        if (characterRepository.count() > 0) {
            return;
        }

        // Dodaj postacie
        Character pyromancer = new Character();
        pyromancer.setName("Pyromancer");
        pyromancer.setBackGroundImageUrl("/images/HeroBackGround/Pyromancer.jpg");
        pyromancer.setHeroImageUrl("/images/HeroImage/Pyromancer.png");
        pyromancer.setDescription("The Pyromancer has only one way to deal with her enemies: swift, hot destruction. Even her defense is offensive. She is a glass cannon who deals massive amounts of damage, turning her foes to ash.\n");

        Character shadowThief = new Character();
        shadowThief.setName("Shadow Thief");
        shadowThief.setBackGroundImageUrl("/images/HeroBackGround/ShadowThief.jpg");
        shadowThief.setHeroImageUrl("/images/HeroImage/ShadowThief.png");
        shadowThief.setDescription("The Shadow Thief doesn’t like to end things quickly. He prefers running the long con. Increasing his health, poisoning his foes, hiding & striking from the shadows — that’s his style. If allowed to reach the conclusion of his complicated game plan, his victims will find themselves in utter ruin..\n");

        Character monk = new Character();
        monk.setName("Monk");
        monk.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(monk.getName()));
        monk.setHeroImageUrl("/images/HeroImage/%s.png".formatted(monk.getName()));
        monk.setDescription("The Monk is a master in the art of Chi. He can channel this ancient energy to absorb incoming attacks from his opponents. He can also use Chi to unleash a maelstrom of pain. The Monk is not only the calm before the storm but the storm itself.");

        Character palladyn = new Character();
        palladyn.setName("Paladin");
        palladyn.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(palladyn.getName()));
        palladyn.setHeroImageUrl("/images/HeroImage/%s.png".formatted(palladyn.getName()));
        palladyn.setDescription("The Paladin’s sword of righteousness strikes hard and true. Through faithful devotion, he is capable of celestial defense. The Paladin wades into battle assured that the Divine is with him and that victory is his sovereign right.");

        Character ninja = new Character();
        ninja.setName("ninja");
        ninja.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(ninja.getName()));
        ninja.setHeroImageUrl("/images/HeroImage/%s.png".formatted(ninja.getName()));
        ninja.setDescription("The Ninja knows that victory is never truly certain, so she has spent countless hours to hone her craft. As a master of ninjutsu, she deals massive amounts of damage using unconventional methods. When she’s prepared, she can even dodge incoming attacks with more consistency than any other hero.");

        Character treant = new Character();
        treant.setName("treant");
        treant.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(treant.getName()));
        treant.setHeroImageUrl("/images/HeroImage/%s.png".formatted(treant.getName()));
        treant.setDescription("The Treant is the most elder of contenders. He decided he could no longer be a stick in the mud weeping over willows. He chose to branch out, leafing his thicket behind with a sappy goodbye. He dug deep, packed his trunk, spruced himself up, and began lumbering ever closer to the true root of the problem--the Mad King.\n");

        Character tactician = new Character();
        tactician.setName("Tactician");
        tactician.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(tactician.getName()));
        tactician.setHeroImageUrl("/images/HeroImage/%s.png".formatted(tactician.getName()));
        tactician.setDescription("The Tactician surveys the battlefield with assurance and calm, confident that there is no foe greater than he. From atop the higher ground, he claims victory by asserting absolute control over all that he sees.");

        Character huntress = new Character();
        huntress.setName("Huntress");
        huntress.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(huntress.getName()));
        huntress.setHeroImageUrl("/images/HeroImage/%s.png".formatted(huntress.getName()));
        huntress.setDescription("Rescued as an infant by Nyra (a female sabertooth tiger), the Huntress was taken in as if she was Nyra’s own cub. Their bond is beyond that of a human to her pet. They are connected--soul to soul. The ferocity and agility with which they fight intimidates all who would dare to challenge them.");

        Character seraph = new Character();
        seraph.setName("Seraph");
        seraph.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(seraph.getName()));
        seraph.setHeroImageUrl("/images/HeroImage/%s.png".formatted(seraph.getName()));
        seraph.setDescription("To look into the face of the Seraph is to gaze upon the hand of God. Her blades are infused with holy energy designed to cut evil from the earth. Her crystal wings carry her above the battlefield where her brilliant light blinds all who do not avert their gaze. Humble yourself before her holy presence or die.");

        Character vampire = new Character();
        vampire.setName("Vampire");
        vampire.setBackGroundImageUrl("/images/HeroBackGround/%s.jpg".formatted(vampire.getName()));
        vampire.setHeroImageUrl("/images/HeroImage/%s.png".formatted(vampire.getName()));
        vampire.setDescription("The Vampire Lord's power paralyzes even the bravest fighters. No combatant is more vicious. Her rending claws will leave her foes bloody and hemorrhaging. Attempting to resist her mesmerizing gaze or overcome her powerful blood magic will prove deadly for any foolish enough to oppose her!");

        characterRepository.save(monk);
        characterRepository.save(ninja);
        characterRepository.save(palladyn);
        characterRepository.save(pyromancer);
        characterRepository.save(shadowThief);
        characterRepository.save(vampire);
        characterRepository.save(seraph);
        characterRepository.save(huntress);
        characterRepository.save(tactician);
        characterRepository.save(treant);

        Player player1 = new Player();
        player1.setName("Darek");

        Player player2 = new Player();
        player2.setName("Julia");

        Player player3 = new Player();
        player3.setName("Seba");

        playerRepository.save(player1);
        playerRepository.save(player2);
        playerRepository.save(player3);

        System.out.println("✅ Dodano 10 postacie do bazy!");
        System.out.println("✅ Dodano 2 graczy do bazy!");
    }
}