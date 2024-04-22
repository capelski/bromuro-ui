import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
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
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
      style={{
        opacity: props.opacity,
        transform: [{ translateX: props.position }],
      }}
    >
      {props.currentError.value ? (
        <Text style={sentenceStyle.even}>{props.currentError.value}</Text>
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

const sentenceBaseStyle = {
  paddingHorizontal: 16,
  paddingVertical: 16,
  marginVertical: 8,
  fontSize: 24,
  fontWeight: 'bold' as 'bold',
  lineHeight: 28,
};

export const getSentenceStyle = (theme: Theme) => {
  return StyleSheet.create({
    odd: {
      ...sentenceBaseStyle,
      color: theme.sentenceColor,
      backgroundColor: '#fff',
      transform: [{ rotate: '-2deg' }],
    },
    even: {
      ...sentenceBaseStyle,
      backgroundColor: theme.sentenceColor,
      color: '#fff',
      transform: [{ rotate: '2deg' }],
    },
  });
};
