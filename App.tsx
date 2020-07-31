import React, { useState } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { getRandomJoke } from './components/jokes';
import { NextButton } from './components/buttons/next';
import { PreviousButton } from './components/buttons/previous';
import { getButtonStyle, allStyles, getSentenceStyle } from './components/styles';
import { getRandomTheme } from './components/themes';

const initialTheme = getRandomTheme();
// TODO Retrieve the ids from local storage
const initialJoke = getRandomJoke([]);

export default function App() {
    const [jokes, setJokes] = useState([initialJoke]);
    const [jokeIndex, setJokeIndex] = useState(0);
    const [theme, setTheme] = useState(initialTheme);

    const buttonStyle = getButtonStyle(theme);
    const sentenceStyle = getSentenceStyle(theme);

    const isPreviousButtonEnabled = jokeIndex > 0;

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
                        buttonStyle={buttonStyle.button}
                        fillColor={buttonStyle.path.color}
                        isEnabled={isPreviousButtonEnabled}
                        onPress={previousHandler}
                    />
                    <NextButton
                        onPress={nextHandler}
                        buttonStyle={buttonStyle.button}
                        fillColor={buttonStyle.path.color}
                    />
                </View>
            </View>
        </ImageBackground>
    );
}
