import React, { useState, useEffect, useMemo } from 'react';
import { ImageBackground, Text, View, Animated, TextInput } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
    MovementDirection,
    translateJoke,
    enterRightAnimation,
    enterLeftAnimation,
    exitLeftAnimation,
    exitRightAnimation
} from './src/animations';
import { NextButton } from './src/components/buttons/next';
import { PreviousButton } from './src/components/buttons/previous';
import { SearchButton } from './src/components/buttons/search';
import { getNetworkJoke } from './src/jokes-network';
import { getButtonStyle, allStyles, getSentenceStyle } from './src/styles';
import { getRandomTheme } from './src/themes';
import { Joke } from './src/types';

const initialTheme = getRandomTheme();

// TODO Refactor

export default function App() {
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [jokeIndex, setJokeIndex] = useState(-1);
    const [theme, setTheme] = useState(initialTheme);
    const [direction, setDirection] = useState<MovementDirection>('left');
    const [isSearcherVisible, setIsSearcherVisible] = useState(false);
    const [filter, setFilter] = useState('');
    const [searcherOffsets, setSearcherOffsets] = useState<{ [key: string]: number }>({});
    const [lastError, setLastError] = useState<{ ref: string | undefined }>({ ref: undefined });

    const opacity = useMemo(() => new Animated.Value(0), []);
    const position = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        // TODO Retrieve the ids from local storage
        getNetworkJoke([])
            .then((joke) => {
                setJokes([joke]);
                setJokeIndex(0);
            })
            .catch((error) => {
                setLastError({ ref: error.message });
            });
    }, []);

    useEffect(() => {
        Animated.sequence([
            translateJoke(position, direction),
            (direction === 'left' ? enterRightAnimation : enterLeftAnimation)(opacity, position)
        ]).start();
    }, [jokeIndex, lastError]);

    const sentenceStyle = getSentenceStyle(theme);

    const isPreviousButtonEnabled = jokeIndex > 0;

    const previousButtonStyle = getButtonStyle(theme, isPreviousButtonEnabled);
    const searchButtonStyle = getButtonStyle(theme, true, isSearcherVisible);
    const nextButtonStyle = getButtonStyle(theme);

    const nextHandler = () => {
        exitLeftAnimation(opacity, position).start(() => {
            setDirection('left');
            setTheme(getRandomTheme(theme));

            if (jokeIndex < jokes.length - 1) {
                setLastError({ ref: undefined });
                setJokeIndex(jokeIndex + 1);
            } else {
                let offset = searcherOffsets[filter];
                if (filter && isNaN(searcherOffsets[filter])) {
                    offset = 0;
                    setSearcherOffsets({
                        ...searcherOffsets,
                        [filter]: offset
                    });
                }

                getNetworkJoke(
                    // TODO Retrieve the ids from local storage
                    jokes.map((j) => j.id),
                    filter,
                    offset
                )
                    .then((joke) => {
                        setLastError({ ref: undefined });
                        if (filter) {
                            setSearcherOffsets({
                                ...searcherOffsets,
                                [filter]: offset + 1
                            });
                        }
                        setJokes(jokes.concat(joke));
                        setJokeIndex(jokeIndex + 1);
                    })
                    .catch((error) => {
                        setLastError({ ref: error.message });
                    });
            }
        });
    };

    const previousHandler = () => {
        if (isPreviousButtonEnabled) {
            Animated.sequence([exitRightAnimation(opacity, position)]).start(() => {
                setDirection('right');
                setTheme(getRandomTheme(theme));
                if (lastError.ref) {
                    setLastError({ ref: undefined });
                } else {
                    setJokeIndex(jokeIndex - 1);
                }
            });
        }
    };

    const searchHandler = () => {
        setIsSearcherVisible(!isSearcherVisible);
    };

    const currentJoke = lastError.ref ? { text: [lastError.ref] } : jokes[jokeIndex];

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
                            displaySearchIcon={Boolean(filter) && jokeIndex === jokes.length - 1}
                            fillColor={nextButtonStyle.path.color}
                            onPress={nextHandler}
                        />
                    </View>
                    {isSearcherVisible && (
                        <View style={allStyles.searcher}>
                            <TextInput
                                value={filter}
                                onChangeText={setFilter}
                                style={allStyles.searcherInput}
                            />
                            {filter !== '' && (
                                <Svg
                                    viewBox="0 0 352 512"
                                    height={32}
                                    width={32}
                                    onPress={() => {
                                        setFilter('');
                                    }}
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
