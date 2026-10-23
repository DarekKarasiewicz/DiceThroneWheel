// Service worker: po pierwszym otwarciu cała aplikacja (kod + dane JSON + obrazki) działa offline.
const CACHE = 'dicethrone-v2';

const STATIC_FILES = [
    './',
    'index.html',
    'manifest.json',
    'favicon.ico',
    'logo192.png',
    'logo512.png',
    'data/characters.json',
    'data/players.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await cache.addAll(STATIC_FILES);
        // Zbudowane pliki JS/CSS mają hashe w nazwach - bierzemy je z asset-manifest.json
        const manifest = await fetch('asset-manifest.json', { cache: 'no-store' }).then(r => r.json());
        await cache.addAll(Object.values(manifest.files).filter(f => !f.endsWith('.map')));
        // Obrazki bohaterów - z listy w characters.json
        const characters = await fetch('data/characters.json', { cache: 'no-store' }).then(r => r.json());
        await cache.addAll(characters.flatMap(c => [c.heroImage, c.backgroundImage]));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

// Najpierw sieć (żeby dostać nową wersję), offline -> z cache
async function networkFirst(request, cacheKey) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(CACHE);
            cache.put(cacheKey, response.clone());
        }
        return response;
    } catch {
        return (await caches.match(cacheKey, { ignoreSearch: true })) || Response.error();
    }
}

// Najpierw cache (pliki z hashem w nazwie i obrazki się nie zmieniają)
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone());
    }
    return response;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) return;

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, 'index.html'));
    } else if (url.pathname.endsWith('.json')) {
        event.respondWith(networkFirst(request, request));
    } else {
        event.respondWith(cacheFirst(request));
    }
});
