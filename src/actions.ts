import { getMatchingJoke, getRandomJoke } from './jokes-network';
import { getRandomTheme } from './themes';
import { Joke, State, StateSetters } from './types';

export const displayLastJoke = (state: State, stateSetters: StateSetters) => {
    stateSetters.setDirection('left');
    stateSetters.setJokeIndex(state.jokes.length - 1);
};

export const displayNextJoke = (state: State, stateSetters: StateSetters, nextJoke?: Joke) => {
    stateSetters.setDirection('left');
    stateSetters.setJokeIndex(state.jokeIndex + 1);
    stateSetters.setTheme(getRandomTheme(state.theme));
    if (nextJoke) {
        stateSetters.setJokes(state.jokes.concat(nextJoke));
    }
};

export const displayPreviousJoke = (state: State, stateSetters: StateSetters) => {
    stateSetters.setDirection('right');
    stateSetters.setTheme(getRandomTheme(state.theme));
    if (state.currentError.ref) {
        stateSetters.setCurrentError({ ref: undefined });
    } else {
        stateSetters.setJokeIndex(state.jokeIndex - 1);
    }
};

export const isFirstJoke = (index: number) => index === 0;

export const isLastJoke = (jokes: Joke[], jokeIndex: number) => jokeIndex === jokes.length - 1;

export const loadMatchingJoke = (state: State, stateSetters: StateSetters) => {
    let offset = isNaN(state.searcherOffsets[state.filter])
        ? 0
        : state.searcherOffsets[state.filter];
    return getMatchingJoke(state.filter, offset)
        .then((joke) => {
            displayNextJoke(state, stateSetters, joke);
            stateSetters.setSearcherOffsets({
                ...state.searcherOffsets,
                [state.filter]: offset + 1
            });
            stateSetters.setCurrentError({ ref: undefined });
        })
        .catch((error) => {
            console.log(error);
            stateSetters.setCurrentError({ ref: error.message });
            // TODO If 404 clear the filter
        });
};

export const loadRandomJoke = (state: State, stateSetters: StateSetters) => {
    getRandomJoke(
        // TODO Retrieve the ids from local storage
        []
    )
        .then((joke) => {
            displayNextJoke(state, stateSetters, joke);
            stateSetters.setCurrentError({ ref: undefined });
        })
        .catch((error) => {
            console.log(error);
            stateSetters.setCurrentError({ ref: error.message });
        });
};
