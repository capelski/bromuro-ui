import alphaBg from '../assets/backgrounds/alpha-bg.png';
import betaBg from '../assets/backgrounds/beta-bg.png';
import gammaBg from '../assets/backgrounds/gamma-bg.png';
import deltaBg from '../assets/backgrounds/delta-bg.png';

export interface Theme {
    backgroundImage: any;
    backgroundStyle: any;
    sentenceColor: string;
}

const themes: Theme[] = [
    {
        backgroundImage: alphaBg,
        backgroundStyle: { flex: 1, backgroundColor: '#4d6cfa' },
        sentenceColor: '#477106'
    },
    {
        backgroundImage: betaBg,
        backgroundStyle: { flex: 1, backgroundColor: '#d8305a' },
        sentenceColor: '#fc863b'
    },
    {
        backgroundImage: gammaBg,
        backgroundStyle: { flex: 1, backgroundColor: '#a094ff' },
        sentenceColor: '#4d36fe'
    },
    {
        backgroundImage: deltaBg,
        backgroundStyle: { flex: 1, backgroundColor: '#94dfff' },
        sentenceColor: '#ff6767'
    }
];

export const getRandomTheme = (current?: Theme) =>
    themes.filter((b) => b !== current)[Math.floor(Math.random() * (themes.length - 1))];
