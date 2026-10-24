// Lokalny zamiennik backendu (Spring + PostgreSQL) dla wersji offline / GitHub Pages.
//
// Dane:
//  - public/data/characters.json  – bohaterowie (edytowalne w repozytorium)
//  - gracze + gry + losowania     – dokument JSON zapisywany na urządzeniu,
//                                   eksportowany / importowany jako plik .json
//                                   (bez importu lista graczy jest pusta)
//
// Udostępnia ten sam interfejs co instancja axios (get/post/put -> { data }),
// więc komponenty nie muszą wiedzieć, skąd pochodzą dane.

const RESULTS_KEY = 'dicethrone-data';
const RESULTS_VERSION = 4;

const asset = (path) => `${process.env.PUBLIC_URL}/${path}`;

// --- Pliki JSON z repozytorium ---

let charactersPromise = null;

async function fetchJson(path) {
    const response = await fetch(asset(path), { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Failed to load ${path}: ${response.status}`);
    return response.json();
}

function loadCharacters() {
    if (!charactersPromise) {
        charactersPromise = fetchJson('data/characters.json').catch((err) => {
            charactersPromise = null;
            throw err;
        });
    }
    return charactersPromise;
}

// --- Dane zapisywane na urządzeniu ---

function isValidResults(data) {
    return data && Array.isArray(data.games) && Array.isArray(data.draws);
}

// Wersje < 4 same wpisywały domyślnych graczy z players.json. Jeśli na urządzeniu
// nie ma jeszcze żadnego losowania, takich graczy nie traktujemy jako zaimportowanych.
const hasOnlyDefaultPlayers = (data) => !(data.version >= 4) && data.draws.length === 0;

function loadResults() {
    try {
        const raw = localStorage.getItem(RESULTS_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (isValidResults(data)) {
                const players = Array.isArray(data.players) && !hasOnlyDefaultPlayers(data) ? data.players : [];
                return { version: RESULTS_VERSION, players, games: data.games, draws: data.draws };
            }
        }
    } catch (e) {
        console.error('Failed to read local data, starting fresh:', e);
    }
    return { version: RESULTS_VERSION, players: [], games: [], draws: [] };
}

function saveResults(results) {
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

const nextId = (items) => items.reduce((max, item) => Math.max(max, item.id), 0) + 1;

// --- Mapowanie na kształt DTO zwracany wcześniej przez backend ---

const toCharacterDTO = (c) => ({
    id: c.id,
    name: c.name,
    heroImageUrl: asset(c.heroImage),
    backGroundImageUrl: asset(c.backgroundImage),
    description: c.description,
});

const toGameDTO = (g) => ({ id: g.id, status: g.status, winner_id: g.winner_id, draws: null });

function toDrawDTO(db, d) {
    const character = db.characters.find(c => c.id === d.characterId);
    const game = db.games.find(g => g.id === d.gameId);
    return {
        id: d.id,
        character: character ? toCharacterDTO(character) : null,
        timestamp: d.timestamp,
        game: game ? toGameDTO(game) : null,
        sessionId: null,
    };
}

const round1 = (n) => Math.round(n * 10) / 10;

// Port StatsService.buildPlayerStats
function buildPlayerStats(db, player) {
    const totalHeroes = db.characters.length;
    const gamesById = new Map(db.games.map(g => [g.id, g]));
    const charactersById = new Map(db.characters.map(c => [c.id, c]));
    const isWin = (d) => gamesById.get(d.gameId)?.winner_id === d.characterId;

    const draws = db.draws.filter(d => d.playerId === player.id && charactersById.has(d.characterId));
    const totalGames = draws.length;
    const winningDraws = draws.filter(isWin);
    const totalWins = winningDraws.length;
    const winRate = totalGames > 0 ? totalWins / totalGames * 100 : 0;

    const countByCharacter = (list) => list.reduce((acc, d) => acc.set(d.characterId, (acc.get(d.characterId) || 0) + 1), new Map());
    const maxEntry = (map) => [...map.entries()].reduce((best, e) => (!best || e[1] > best[1] ? e : best), null);

    const playCount = countByCharacter(draws);
    const mostPlayed = maxEntry(playCount);
    const luckyChar = maxEntry(countByCharacter(winningDraws));

    const uniqueHeroes = playCount.size;
    const heroExplorationRate = totalHeroes > 0 ? uniqueHeroes / totalHeroes * 100 : 0;

    const sorted = [...draws].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    let longestStreak = 0;
    let tempStreak = 0;
    for (const d of sorted) {
        tempStreak = isWin(d) ? tempStreak + 1 : 0;
        longestStreak = Math.max(longestStreak, tempStreak);
    }
    let currentStreak = 0;
    for (let i = sorted.length - 1; i >= 0 && isWin(sorted[i]); i--) {
        currentStreak++;
    }

    const avgGamesBetweenWins = totalWins > 0 ? totalGames / totalWins : 0;
    const characterDTO = (entry) => (entry ? toCharacterDTO(charactersById.get(entry[0])) : null);

    return {
        playerId: player.id,
        playerName: player.name,
        totalGames,
        totalWins,
        winRate: round1(winRate),
        mostPlayedCharacter: characterDTO(mostPlayed),
        mostPlayedCount: mostPlayed ? mostPlayed[1] : 0,
        luckyCharacter: characterDTO(luckyChar),
        luckyCharacterWins: luckyChar ? luckyChar[1] : 0,
        uniqueHeroesPlayed: uniqueHeroes,
        totalHeroesAvailable: totalHeroes,
        currentWinStreak: currentStreak,
        longestWinStreak: longestStreak,
        avgGamesBetweenWins: round1(avgGamesBetweenWins),
        heroExplorationRate: round1(heroExplorationRate),
    };
}

function notFound(what, id) {
    throw new Error(`${what} not found: ${id}`);
}

// --- "Endpointy" (db = bohaterowie z characters.json + gracze i wyniki z urządzenia) ---

const routes = {
    'GET /characters': (db) => db.characters.map(toCharacterDTO),

    'GET /players': (db) => db.players.map(p => ({ id: p.id, name: p.name, draws: null })),

    'POST /game/create': (db) => {
        const game = { id: nextId(db.games), status: null, winner_id: 0, timestamp: new Date().toISOString() };
        db.games.push(game);
        db.save();
        return toGameDTO(game);
    },

    'GET /game/history': (db) => db.games.map(toGameDTO),

    'PUT /game/save': (db, { gameId, winnerId, gameStatus }) => {
        const id = Number(gameId);
        const game = db.games.find(g => g.id === id) || notFound('Game', id);
        if (Number(winnerId) !== 0) game.winner_id = Number(winnerId);
        if (gameStatus && gameStatus.trim()) game.status = gameStatus.toUpperCase();
        db.save();
        return toGameDTO(game);
    },

    'POST /draw': (db) => {
        if (db.characters.length === 0) throw new Error('There are no characters');
        const character = db.characters[Math.floor(Math.random() * db.characters.length)];
        return { id: 0, character: toCharacterDTO(character), timestamp: new Date().toISOString(), game: null, sessionId: null };
    },

    'POST /draw/save': (db, { playerId, characterId, gameId }) => {
        const pId = Number(playerId);
        const cId = Number(characterId);
        const gId = Number(gameId);
        if (!db.players.some(p => p.id === pId)) notFound('Player', pId);
        if (!db.characters.some(c => c.id === cId)) notFound('Character', cId);
        if (!db.games.some(g => g.id === gId)) notFound('Game', gId);
        const draw = { id: nextId(db.draws), characterId: cId, playerId: pId, gameId: gId, timestamp: new Date().toISOString() };
        db.draws.push(draw);
        db.save();
        return toDrawDTO(db, draw);
    },

    // Losowania bohaterów usuniętych z characters.json są pomijane
    'GET /draw/history': (db) => db.draws
        .map(d => toDrawDTO(db, d))
        .filter(d => d.character && d.game),

    'GET /stats/players': (db) => db.players
        .map(p => buildPlayerStats(db, p))
        .sort((a, b) => b.totalWins - a.totalWins),
};

async function request(method, url, config = {}) {
    const handler = routes[`${method} ${url}`];
    if (!handler) throw new Error(`Unknown local endpoint: ${method} ${url}`);

    const characters = await loadCharacters();
    const results = loadResults();
    const db = {
        characters,
        players: results.players,
        games: results.games,
        draws: results.draws,
        save: () => saveResults(results),
    };
    return { data: handler(db, config.params || {}) };
}

const localApi = {
    get: (url, config) => request('GET', url, config),
    post: (url, body, config) => request('POST', url, config),
    put: (url, body, config) => request('PUT', url, config),
};

// --- Eksport / import pliku z danymi (gracze + gry + losowania) ---

export function exportData() {
    return JSON.stringify(loadResults(), null, 2);
}

const GAME_STATUSES = ['FINISHED', 'IN_PROGRESS', 'CANCELLED'];
const MAX_NAME_LENGTH = 40;
const isId = (v) => Number.isInteger(v) && v >= 0;
const isTimestamp = (v) => typeof v === 'string' && v.length <= 40 && !Number.isNaN(Date.parse(v));

function invalid(reason) {
    throw new Error(`Invalid DiceThrone data file: ${reason}`);
}

// Z importowanego pliku bierzemy tylko znane pola o poprawnych typach
function sanitizePlayers(players) {
    if (!Array.isArray(players) || players.length === 0) invalid('no players');
    const result = players.map((p) => {
        const name = typeof p?.name === 'string' ? p.name.trim() : '';
        if (!isId(p?.id) || p.id === 0 || !name || name.length > MAX_NAME_LENGTH) invalid('bad player entry');
        return { id: p.id, name };
    });
    if (new Set(result.map(p => p.id)).size !== result.length) invalid('duplicate player id');
    return result;
}

function sanitizeGame(g) {
    if (!g || !isId(g.id) || g.id === 0 || !isId(g.winner_id) || !isTimestamp(g.timestamp)) return null;
    if (g.status !== null && g.status !== undefined && !GAME_STATUSES.includes(g.status)) return null;
    return { id: g.id, status: g.status ?? null, winner_id: g.winner_id, timestamp: g.timestamp };
}

function sanitizeDraw(d) {
    if (!d || ![d.id, d.characterId, d.playerId, d.gameId].every(v => isId(v) && v > 0) || !isTimestamp(d.timestamp)) return null;
    return { id: d.id, characterId: d.characterId, playerId: d.playerId, gameId: d.gameId, timestamp: d.timestamp };
}

// Plik bez listy graczy (starszy format) zostawia obecnych graczy z urządzenia
export function importData(json) {
    const data = JSON.parse(json);
    if (!isValidResults(data)) invalid('missing games or draws');
    const players = data.players !== undefined ? sanitizePlayers(data.players) : loadResults().players;
    const games = data.games.map(sanitizeGame);
    const draws = data.draws.map(sanitizeDraw);
    if (games.includes(null) || draws.includes(null)) invalid('bad game or draw entry');
    const playerIds = new Set(players.map(p => p.id));
    if (draws.some(d => !playerIds.has(d.playerId))) invalid('draw references unknown player');
    saveResults({ version: RESULTS_VERSION, players, games, draws });
}

export default localApi;
