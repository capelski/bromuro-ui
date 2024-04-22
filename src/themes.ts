import alphaBg from '../assets/backgrounds/alpha-bg.png';
import betaBg from '../assets/backgrounds/beta-bg.png';
import gammaBg from '../assets/backgrounds/gamma-bg.png';
import deltaBg from '../assets/backgrounds/delta-bg.png';
import { Theme } from './types';

const themes: Theme[] = [
  {
    backgroundColor: '#4d6cfa',
    backgroundImage: alphaBg,
    sentenceColor: '#477106',
  },
  {
    backgroundColor: '#d8305a',
    backgroundImage: betaBg,
    sentenceColor: '#fc863b',
  },
  {
    backgroundColor: '#a094ff',
    backgroundImage: gammaBg,
    sentenceColor: '#4d36fe',
  },
  {
    backgroundColor: '#94dfff',
    backgroundImage: deltaBg,
    sentenceColor: '#ff6767',
  },
];

export const getRandomTheme = (current?: Theme) =>
  themes.filter((b) => b !== current)[Math.floor(Math.random() * (themes.length - 1))];
