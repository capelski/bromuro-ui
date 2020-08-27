import source from './jokes.json';

export interface Joke {
    id: number;
    text: string[];
}

const jokes: Joke[] = source.map((text, index) => ({
    id: index + 1,
    text
}));

// TODO Use network calls
export const getRandomJoke = (consumedIds: number[]) => {
    const freshJokes = jokes.filter((j) => consumedIds.indexOf(j.id) === -1);
    return freshJokes[Math.floor(Math.random() * (freshJokes.length - 1))];
};
