import source from './jokes.json';
import { Joke } from './types';

const jokes: Joke[] = source.map((text, index) => ({
    id: index + 1,
    text
}));

export const getMemoryJoke = (consumedIds: number[]) => {
    const freshJokes = jokes.filter((j) => consumedIds.indexOf(j.id) === -1);
    const randomJokeIndex = Math.floor(Math.random() * (freshJokes.length - 1));
    return freshJokes[randomJokeIndex];
};
