import AsyncStorage from '@react-native-community/async-storage';
import { getJokeById, getLimits, getMatchingJoke } from './jokes-network';
import { getRandomTheme } from './themes';
import { Joke, State, StateSetters } from './types';

const addDisplayedJokeId = (displayedJokesId: number[], nextJokeId: number) => {
    if (displayedJokesId.indexOf(nextJokeId) === -1) {
        displayedJokesId.push(nextJokeId);
        displayedJokesId.sort((a, b) => a - b);
        // In case the setItem function throws an exception, we do nothing:
        // displayedJokesId will not be updated. Shit happens
        AsyncStorage.setItem('displayedJokesId', JSON.stringify(displayedJokesId)).catch(
            console.warn
        );
    }
};

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
    if (state.currentError.value) {
        stateSetters.setCurrentError({ value: undefined });
    } else {
        stateSetters.setJokeIndex(state.jokeIndex - 1);
    }
};

const getDisplayedJokesId = () =>
    AsyncStorage.getItem('displayedJokesId')
        .then((value) => (value !== null ? JSON.parse(value) : []))
        .catch((error) => {
            console.warn(error);
            return [];
        });

export const isFirstJoke = (index: number) => index === 0;

export const isLastJoke = (jokes: Joke[], jokeIndex: number) => jokeIndex === jokes.length - 1;

export const loadFirstJoke = (state: State, stateSetters: StateSetters) => {
    return getLimits()
        .then((limits) => {
            stateSetters.setLimits(limits);
            loadRandomJoke({ ...state, limits }, stateSetters);
        })
        .catch((error) => {
            console.warn(error);
            stateSetters.setCurrentError({ value: error.message });
        });
};

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
            stateSetters.setCurrentError({ value: undefined });

            getDisplayedJokesId().then((displayedJokesId) =>
                addDisplayedJokeId(displayedJokesId, joke.id)
            );
        })
        .catch((error) => {
            console.warn(error);
            stateSetters.setCurrentError({ value: error.message });
            stateSetters.setFilter('');
            stateSetters.setIsSearcherVisible(false);
        });
};

export const loadRandomJoke = (state: State, stateSetters: StateSetters) => {
    let displayedJokesId: number[];
    getDisplayedJokesId()
        .then((jokesId) => {
            displayedJokesId = jokesId;

            if (displayedJokesId.length >= state.limits.newest) {
                displayedJokesId = [];
            }

            let randomJokeId =
                Math.floor(Math.random() * (state.limits.newest - state.limits.oldest)) +
                state.limits.oldest;

            while (displayedJokesId.indexOf(randomJokeId) > -1) {
                randomJokeId = (randomJokeId + 1) % (state.limits.newest + 1);
            }
            return getJokeById(randomJokeId);
        })
        .then((joke) => {
            displayNextJoke(state, stateSetters, joke);
            stateSetters.setCurrentError({ value: undefined });
            addDisplayedJokeId(displayedJokesId, joke.id);
        })
        .catch((error) => {
            console.warn(error);
            stateSetters.setCurrentError({ value: error.message });
        });
};
