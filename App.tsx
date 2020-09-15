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

export default function App() {
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [jokeIndex, setJokeIndex] = useState(-1);
    const [theme, setTheme] = useState(initialTheme);
    const [direction, setDirection] = useState<MovementDirection>('left');
    const [isSearcherVisible, setIsSearcherVisible] = useState(false);
    const [filter, setFilter] = useState('');
    const [searcherOffsets, setSearcherOffsets] = useState<{ [key: string]: number }>({});

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
                // TODO Capture error and tell the user
                console.log(error);
            });
    }, []);

    useEffect(() => {
        Animated.sequence([
            translateJoke(position, direction),
            (direction === 'left' ? enterRightAnimation : enterLeftAnimation)(opacity, position)
        ]).start();
    }, [jokeIndex]);

    const sentenceStyle = getSentenceStyle(theme);

    const isPreviousButtonEnabled = jokeIndex > 0;

    const previousButtonStyle = getButtonStyle(theme, isPreviousButtonEnabled);
    const searchButtonStyle = getButtonStyle(theme, true, isSearcherVisible || filter !== '');
    const nextButtonStyle = getButtonStyle(theme);

    const nextHandler = () => {
        exitLeftAnimation(opacity, position).start(() => {
            if (jokeIndex < jokes.length - 1) {
                setDirection('left');
                setTheme(getRandomTheme(theme));
                setJokeIndex(jokeIndex + 1);
            } else {
                // TODO Retrieve the ids from local storage
                if (filter && searcherOffsets[filter] === undefined) {
                    searcherOffsets[filter] = 0;
                }
                getNetworkJoke(
                    jokes.map((j) => j.id),
                    filter,
                    searcherOffsets[filter]
                )
                    .then((joke) => {
                        if (filter) {
                            setSearcherOffsets({
                                ...searcherOffsets,
                                [filter]: searcherOffsets[filter] + 1
                            });
                        }
                        setDirection('left');
                        setTheme(getRandomTheme(theme));
                        setJokes(jokes.concat(joke));
                        setJokeIndex(jokeIndex + 1);
                    })
                    .catch((error) => {
                        // TODO Capture error and tell the user
                        // TODO If (filter)and 404, set the searcherOffsets to -1
                        console.log(error);
                    });
            }
        });
    };

    const previousHandler = () => {
        if (isPreviousButtonEnabled) {
            Animated.sequence([exitRightAnimation(opacity, position)]).start(() => {
                setDirection('right');
                setTheme(getRandomTheme(theme));
                setJokeIndex(jokeIndex - 1);
            });
        }
    };

    const searchHandler = () => {
        setIsSearcherVisible(!isSearcherVisible);
    };

    const currentJoke = jokes[jokeIndex];

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
                            fillColor={nextButtonStyle.path.color}
                            onPress={nextHandler}
                        />
                    </View>
                    {isSearcherVisible && (
                        <View
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                            <TextInput
                                value={filter}
                                onChangeText={setFilter}
                                style={allStyles.textInput}
                            />
                            {filter !== '' && (
                                <Svg
                                    viewBox="0 0 352 512"
                                    height={32}
                                    width={32}
                                    onPress={() => {
                                        setFilter('');
                                    }}
                                    style={{
                                        position: 'absolute',
                                        right: 16,
                                        top: 12
                                    }}
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
