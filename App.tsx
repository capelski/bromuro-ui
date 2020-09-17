import React, { useState, useEffect, useMemo } from 'react';
import { ImageBackground, View, Animated } from 'react-native';
import {
    displayLastJoke,
    displayNextJoke,
    displayPreviousJoke,
    isFirstJoke,
    isLastJoke,
    loadMatchingJoke,
    loadRandomJoke
} from './src/actions';
import {
    translateJoke,
    enterRightAnimation,
    enterLeftAnimation,
    exitLeftAnimation,
    exitRightAnimation
} from './src/animations';
import { allStyles } from './src/styles';
import { getRandomTheme } from './src/themes';
import {
    Joke,
    MovementDirection,
    StateSetters,
    State,
    NumericDictionary,
    WrappedValue
} from './src/types';
import { Buttons } from './src/components/buttons';
import { Searcher } from './src/components/searcher';
import { JokesContainer } from './src/components/jokes-container';

const initialTheme = getRandomTheme();

// TODO Replace default icons (e.g. favicon, icon, splash)

export default function App() {
    const [currentError, setCurrentError] = useState<WrappedValue<string>>({
        ref: undefined
    });
    const [direction, setDirection] = useState<MovementDirection>('left');
    const [filter, setFilter] = useState('');
    const [isSearcherVisible, setIsSearcherVisible] = useState(false);
    const [jokeIndex, setJokeIndex] = useState(-1);
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [searcherOffsets, setSearcherOffsets] = useState<NumericDictionary>({});
    const [theme, setTheme] = useState(initialTheme);

    const state: State = {
        currentError,
        direction,
        filter,
        jokeIndex,
        jokes,
        searcherOffsets,
        theme
    };

    const stateSetters: StateSetters = {
        setCurrentError,
        setDirection,
        setJokeIndex,
        setJokes,
        setSearcherOffsets,
        setTheme
    };

    // When application starts, a random joke is loaded
    useEffect(() => {
        loadRandomJoke(state, stateSetters);
    }, []);

    const opacity = useMemo(() => new Animated.Value(0), []);
    const position = useMemo(() => new Animated.Value(0), []);

    // The "enter" animation will be activated every time the jokeIndex changes (e.g.
    // previous or next is clicked) or when an error occurs, to display the message
    useEffect(() => {
        Animated.sequence([
            translateJoke(position, direction),
            (direction === 'left' ? enterRightAnimation : enterLeftAnimation)(opacity, position)
        ]).start();
    }, [jokeIndex, currentError]);

    const nextHandler = () => {
        exitLeftAnimation(opacity, position).start(() => {
            if (!isLastJoke(jokes, jokeIndex)) {
                displayNextJoke(state, stateSetters);
            } else if (state.filter) {
                loadMatchingJoke(state, stateSetters);
            } else {
                loadRandomJoke(state, stateSetters);
            }
        });
    };

    const previousHandler = () => {
        if (!isFirstJoke(jokeIndex)) {
            exitRightAnimation(opacity, position).start(() => {
                displayPreviousJoke(state, stateSetters);
            });
        }
    };

    const searchHandler = () => {
        setIsSearcherVisible(!isSearcherVisible);
        // TODO Focus the text input
    };

    const clearSearchHandler = () => {
        setFilter('');
        // TODO Focus the text input
    };

    const displayLastJokeHandler = () => {
        if (!isLastJoke(jokes, jokeIndex)) {
            exitLeftAnimation(opacity, position).start(() => {
                displayLastJoke(state, stateSetters);
            });
        }
    };

    return (
        <ImageBackground source={theme.backgroundImage} style={theme.backgroundStyle}>
            <View style={allStyles.container}>
                <JokesContainer
                    currentError={currentError}
                    jokeIndex={jokeIndex}
                    jokes={jokes}
                    opacity={opacity}
                    position={position}
                    theme={theme}
                />
                <View>
                    <Buttons
                        displaySearchIcon={Boolean(filter) && isLastJoke(jokes, jokeIndex)}
                        isFirstJoke={isFirstJoke(jokeIndex)}
                        isSearcherVisible={isSearcherVisible}
                        nextHandler={nextHandler}
                        previousHandler={previousHandler}
                        searchHandler={searchHandler}
                        theme={theme}
                    />
                    {isSearcherVisible && (
                        <Searcher
                            clearSearchHandler={clearSearchHandler}
                            displayLastJokeHandler={displayLastJokeHandler}
                            filter={filter}
                            setFilter={setFilter}
                            theme={theme}
                        />
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}
