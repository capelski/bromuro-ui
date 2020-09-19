export interface Joke {
    id: number;
    text: string[];
}

export type Limits = { oldest: number; newest: number };

export type MovementDirection = 'left' | 'right';

export type NumericDictionary = { [key: string]: number };

export interface State {
    currentError: WrappedValue<string>;
    direction: MovementDirection;
    filter: string;
    jokeIndex: number;
    jokes: Joke[];
    limits: Limits;
    searcherOffsets: NumericDictionary;
    theme: Theme;
}

export interface StateSetters {
    setCurrentError: (error: State['currentError']) => void;
    setDirection: (direction: State['direction']) => void;
    setFilter: (filter: State['filter']) => void;
    setIsSearcherVisible: (isSearcherVisible: boolean) => void;
    setJokeIndex: (index: State['jokeIndex']) => void;
    setJokes: (jokes: State['jokes']) => void;
    setLimits: (limits: State['limits']) => void;
    setSearcherOffsets: (offsets: State['searcherOffsets']) => void;
    setTheme: (theme: State['theme']) => void;
}

export interface Theme {
    backgroundImage: any;
    backgroundStyle: any;
    sentenceColor: string;
}

export type WrappedValue<T> = { value?: T };
