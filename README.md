# Dice Throne Wheel

Losowanie bohaterów do gry planszowej **Dice Throne** z historią gier i statystykami graczy.
Aplikacja działa w całości w przeglądarce: **bez serwera i bez bazy danych**, także offline.
Można ją zainstalować na tablecie lub telefonie jako aplikację (PWA).

## Dane

- `public/data/characters.json` – bohaterowie (nazwa, obrazki, opis). Żeby dodać bohatera, dopisz go tu
  (plus obrazki w `public/images/`) i wypchnij zmiany na `main`.
- **gracze, gry i losowania** – jeden dokument JSON zapisywany na urządzeniu (`localStorage`, klucz `dicethrone-data`).
  Nic nie jest wysyłane na serwer.
- `public/data/players.json` – tylko domyślni gracze na start, gdy urządzenie nie ma jeszcze żadnych danych.

Na ekranie startowym są przyciski **Export data / Import data** – zapis i odczyt pliku `.json` z graczami,
grami i losowaniami (na tablecie przez arkusz udostępniania → „Zachowaj w Plikach”).
Import zastępuje wszystkie obecne dane. Plik bez listy `players` (starszy format) zostawia obecnych graczy.

Format pliku:

```json
{
  "version": 3,
  "players": [{ "id": 1, "name": "Darek" }],
  "games":   [{ "id": 1, "status": "FINISHED", "winner_id": 9, "timestamp": "2026-03-09T18:55:34.348Z" }],
  "draws":   [{ "id": 1, "characterId": 9, "playerId": 1, "gameId": 1, "timestamp": "2026-03-09T18:57:49.868Z" }]
}
```

- `status`: `FINISHED`, `IN_PROGRESS`, `CANCELLED` albo `null`; `winner_id` to id bohatera (0 = brak zwycięzcy).
- `characterId` odpowiada `id` w `characters.json` (te same id co w tabeli `characters` w starej bazie PostgreSQL).
- Każde losowanie musi wskazywać gracza z listy `players`. **Nie zmieniaj `id` istniejących wpisów.**

## Struktura

- `src/services/localApi.js` – warstwa danych (gry, losowania, statystyki) z interfejsem w stylu axios.
- `public/sw.js` – service worker: po pierwszym otwarciu aplikacja działa bez internetu.
- `.github/workflows/deploy.yml` – build i publikacja na GitHub Pages po każdym pushu na `main`.

## Uruchomienie lokalnie

```bash
npm ci
npm start                     # tryb deweloperski, http://localhost:3000
npm run build                 # wersja produkcyjna w folderze build/
npx serve@14.2.4 -s build     # podgląd zbudowanej wersji
```

## Instalacja na tablecie / telefonie

1. Otwórz adres strony z GitHub Pages w **Safari** (iPad / iPhone) lub Chrome (Android).
2. **Udostępnij → Do ekranu początkowego** (Android: menu → Zainstaluj aplikację).
3. Uruchom raz z ikony przy włączonym internecie – potem działa offline.

## Ważne o danych

- Wyniki są przypisane do aplikacji zainstalowanej z danego adresu na danym urządzeniu.
  Usunięcie ikony lub wyczyszczenie danych przeglądarki kasuje je – **rób co jakiś czas Export data**.

## Bezpieczeństwo

- Strona ma Content-Security-Policy: skrypty, style, obrazki i dane tylko z własnej domeny.
- Importowany plik jest walidowany – przyjmowane są tylko znane pola o poprawnych typach.
- Workflow ma minimalne uprawnienia, a akcje GitHuba są przypięte do commitów SHA.
- `npm audit --omit=dev` – 0 podatności w kodzie trafiającym na stronę. Ostrzeżenia z `npm audit`
  dotyczą narzędzi buildu (`react-scripts`) i nie trafiają do opublikowanej aplikacji.
