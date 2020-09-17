import React from 'react';
import { Animated, Text } from 'react-native';
import { allStyles, getSentenceStyle } from '../styles';
import { WrappedValue, Theme, Joke } from '../types';

interface JokesContainerProps {
    currentError: WrappedValue<string>;
    jokeIndex: number;
    jokes: Joke[];
    opacity: Animated.Value;
    position: Animated.Value;
    theme: Theme;
}

export const JokesContainer: React.FC<JokesContainerProps> = (props) => {
    const sentenceStyle = getSentenceStyle(props.theme);

    return (
        <Animated.ScrollView
            contentContainerStyle={allStyles.jokesViewport}
            style={{
                opacity: props.opacity,
                transform: [{ translateX: props.position }]
            }}
        >
            {props.currentError.ref ? (
                <Text style={sentenceStyle.odd}>{props.currentError.ref}</Text>
            ) : (
                props.jokes[props.jokeIndex] &&
                props.jokes[props.jokeIndex].text.map((sentence, index) => (
                    <Text
                        key={'sentence' + index}
                        style={Boolean(index % 2) ? sentenceStyle.odd : sentenceStyle.even}
                    >
                        {sentence}
                    </Text>
                ))
            )}
        </Animated.ScrollView>
    );
};
