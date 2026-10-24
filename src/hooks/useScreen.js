import { useEffect, useState } from 'react';

// Progi szerokości ekranu (px)
const PHONE_MAX = 640;      // telefon w pionie
const STACKED_MAX = 900;    // telefon w poziomie / tablet w pionie: panel "Recent Games" pod maszyną
const COMPACT_MAX = 1100;   // mniejszy tablet: mniejsze karty i czcionki

function read() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPhone = width < PHONE_MAX;
    const isShort = height < 500;   // telefon w poziomie
    return {
        width,
        height,
        isPhone,
        isStacked: width < STACKED_MAX,
        isCompact: width < COMPACT_MAX || height < 800,
        // Szerokość jednej karty w maszynie losującej (razem z odstępem)
        cardWidth: isPhone || isShort ? 170 : width < COMPACT_MAX || height < 800 ? 230 : 300,
    };
}

export default function useScreen() {
    const [screen, setScreen] = useState(read);

    useEffect(() => {
        const update = () => setScreen(read());
        window.addEventListener('resize', update);
        window.addEventListener('orientationchange', update);
        return () => {
            window.removeEventListener('resize', update);
            window.removeEventListener('orientationchange', update);
        };
    }, []);

    return screen;
}
