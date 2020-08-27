import React, { useState } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { NextButton } from './src/components/next';
import { PreviousButton } from './src/components/previous';
import { getRandomJoke } from './src/jokes';
import { getButtonStyle, allStyles, getSentenceStyle } from './src/styles';
import { getRandomTheme } from './src/themes';

const initialTheme = getRandomTheme();
// TODO Retrieve the ids from local storage
const initialJoke = getRandomJoke([]);

export default function App() {
    const [jokes, setJokes] = useState([initialJoke]);
    const [jokeIndex, setJokeIndex] = useState(0);
    const [theme, setTheme] = useState(initialTheme);

    const sentenceStyle = getSentenceStyle(theme);

    const isPreviousButtonEnabled = jokeIndex > 0;

    const previousButtonStyle = getButtonStyle(theme, isPreviousButtonEnabled);
    const nextButtonStyle = getButtonStyle(theme);

    const nextHandler = () => {
        const joke = getRandomJoke(jokes.map((j) => j.id));
        setTheme(getRandomTheme(theme));
        setJokes(jokes.concat(joke));
        setJokeIndex(jokeIndex + 1);
    };

    const previousHandler = () => {
        if (isPreviousButtonEnabled) {
            setTheme(getRandomTheme(theme));
            setJokeIndex(jokeIndex - 1);
        }
    };

    const currentJoke = jokes[jokeIndex];

    return (
        <ImageBackground source={theme.backgroundImage} style={theme.backgroundStyle}>
            <View style={allStyles.container}>
                <ScrollView contentContainerStyle={allStyles.jokesViewport}>
                    {currentJoke.text.map((sentence, index) => (
                        <Text
                            key={'sentence' + index}
                            style={Boolean(index % 2) ? sentenceStyle.odd : sentenceStyle.even}
                        >
                            {sentence}
                        </Text>
                    ))}
                </ScrollView>
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
