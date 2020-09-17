import React, { useState, useEffect, useMemo } from 'react';
import { ImageBackground, Text, View, Animated, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
    displayLastJoke,
    displayPreviousJoke,
    isFirstJoke,
    isLastJoke,
    displayNextJoke
} from './src/actions';
import {
    translateJoke,
    enterRightAnimation,
    enterLeftAnimation,
    exitLeftAnimation,
    exitRightAnimation
} from './src/animations';
import { NextButton } from './src/components/buttons/next';
import { PreviousButton } from './src/components/buttons/previous';
import { SearchButton } from './src/components/buttons/search';
import { getButtonStyle, allStyles, getSentenceStyle } from './src/styles';
import { getRandomTheme } from './src/themes';
import { Joke, MovementDirection, StateSetters, State } from './src/types';

const initialTheme = getRandomTheme();

// TODO Replace default icons (e.g. favicon, icon, splash)

export default function App() {
    const [currentError, setCurrentError] = useState<{ ref?: string }>({
        ref: undefined
    });
    const [direction, setDirection] = useState<MovementDirection>('left');
    const [filter, setFilter] = useState('');
    const [isSearcherVisible, setIsSearcherVisible] = useState(false);
    const [jokeIndex, setJokeIndex] = useState(-1);
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [searcherOffsets, setSearcherOffsets] = useState<{ [key: string]: number }>({});
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

    const opacity = useMemo(() => new Animated.Value(0), []);
    const position = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        displayNextJoke(state, stateSetters, true);
    }, []);

    useEffect(() => {
        Animated.sequence([
            translateJoke(position, direction),
            (direction === 'left' ? enterRightAnimation : enterLeftAnimation)(opacity, position)
        ]).start();
    }, [jokeIndex, currentError]);

    const sentenceStyle = getSentenceStyle(theme);

    const previousButtonStyle = getButtonStyle(theme, !isFirstJoke(jokeIndex));
    const searchButtonStyle = getButtonStyle(theme, true, isSearcherVisible);
    const nextButtonStyle = getButtonStyle(theme);

    const nextHandler = () => {
        exitLeftAnimation(opacity, position).start(() => {
            displayNextJoke(state, stateSetters);
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

    // TODO This is not clear at all
    const currentJoke = currentError.ref ? { text: [currentError.ref] } : jokes[jokeIndex];

    return (
        <ImageBackground source={theme.backgroundImage} style={theme.backgroundStyle}>
            <View style={allStyles.container}>
                <Animated.ScrollView
                    contentContainerStyle={allStyles.jokesViewport}
                    style={{
                        opacity,
                        transform: [{ translateX: position }]
                    }}
                >
                    {currentJoke &&
                        currentJoke.text.map((sentence, index) => (
                            <Text
                                key={'sentence' + index}
                                style={Boolean(index % 2) ? sentenceStyle.odd : sentenceStyle.even}
                            >
                                {sentence}
                            </Text>
                        ))}
                </Animated.ScrollView>
                <View>
                    <View style={allStyles.buttons}>
                        <PreviousButton
                            buttonStyle={previousButtonStyle.button}
                            fillColor={previousButtonStyle.path.color}
                            onPress={previousHandler}
                        />
                        <SearchButton
                            buttonStyle={searchButtonStyle.button}
                            fillColor={searchButtonStyle.path.color}
                            onPress={searchHandler}
                        />
                        <NextButton
                            buttonStyle={nextButtonStyle.button}
                            displaySearchIcon={Boolean(filter) && isLastJoke(jokes, jokeIndex)}
                            fillColor={nextButtonStyle.path.color}
                            onPress={nextHandler}
                        />
                    </View>
                    {isSearcherVisible && (
                        <View style={allStyles.searcher}>
                            <TextInput
                                value={filter}
                                onChangeText={setFilter}
                                onFocus={displayLastJokeHandler}
                                style={allStyles.searcherInput}
                            />
                            {filter !== '' && (
                                <Svg
                                    viewBox="0 0 352 512"
                                    height={32}
                                    width={32}
                                    onPress={clearSearchHandler}
                                    style={allStyles.searcherClear}
                                >
                                    <Path
                                        fill={nextButtonStyle.path.color}
                                        d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"
                                    />
                                </Svg>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}
