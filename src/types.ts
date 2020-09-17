export interface Joke {
    id: number;
    text: string[];
}

export type MovementDirection = 'left' | 'right';

export interface State {
    currentError: { ref?: string };
    direction: MovementDirection;
    filter: string;
    jokeIndex: number;
    jokes: Joke[];
    searcherOffsets: { [key: string]: number };
    theme: Theme;
}

export interface StateSetters {
    setCurrentError: (error: State['currentError']) => void;
    setDirection: (direction: State['direction']) => void;
    setJokeIndex: (index: State['jokeIndex']) => void;
    setJokes: (jokes: State['jokes']) => void;
    setSearcherOffsets: (offsets: State['searcherOffsets']) => void;
    setTheme: (theme: State['theme']) => void;
}

export interface Theme {
    backgroundImage: any;
    backgroundStyle: any;
    sentenceColor: string;
}
