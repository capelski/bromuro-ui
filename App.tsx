import React, { useState, useEffect, useMemo } from 'react';
import { ImageBackground, Text, View, Animated } from 'react-native';
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
import { getMemoryJoke } from './src/jokes-json';
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

    const opacity = useMemo(() => new Animated.Value(0), []);
    const position = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        // TODO Retrieve the ids from local storage
        getNetworkJoke([])
            .catch(() => getMemoryJoke([]))
            // TODO Instead of falling back to json jokes, keep the network status in a state property
            .then((joke) => {
                setJokes([joke]);
                setJokeIndex(0);
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
    const nextButtonStyle = getButtonStyle(theme);

    const nextHandler = () => {
        exitLeftAnimation(opacity, position).start(() => {
            // TODO Retrieve the ids from local storage
            getNetworkJoke(jokes.map((j) => j.id))
                .catch(() => getMemoryJoke([]))
                .then((joke) => {
                    setDirection('left');
                    setTheme(getRandomTheme(theme));
                    setJokes(jokes.concat(joke));
                    setJokeIndex(jokeIndex + 1);
                });
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
                <View style={allStyles.buttons}>
                    <PreviousButton
                        buttonStyle={previousButtonStyle.button}
                        fillColor={previousButtonStyle.path.color}
                        onPress={previousHandler}
                    />
                    <NextButton
                        buttonStyle={nextButtonStyle.button}
                        fillColor={nextButtonStyle.path.color}
                        onPress={nextHandler}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}
