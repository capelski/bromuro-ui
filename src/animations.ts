import { Animated } from 'react-native';
import { MovementDirection } from './types';

const translationValue = 50;
const animationsDuration = 400;

export const enterLeftAnimation = (opacity: Animated.Value, position: Animated.Value) =>
  Animated.parallel([
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 1,
      duration: animationsDuration,
    }),
    Animated.timing(position, {
      useNativeDriver: false,
      toValue: 0,
      duration: animationsDuration,
    }),
  ]);

export const enterRightAnimation = (opacity: Animated.Value, position: Animated.Value) =>
  Animated.parallel([
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 1,
      duration: animationsDuration,
    }),
    Animated.timing(position, {
      useNativeDriver: false,
      toValue: 0,
      duration: animationsDuration,
    }),
  ]);

export const exitLeftAnimation = (opacity: Animated.Value, position: Animated.Value) =>
  Animated.parallel([
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 0,
      duration: animationsDuration,
    }),
    Animated.timing(position, {
      useNativeDriver: false,
      toValue: -translationValue,
      duration: animationsDuration,
    }),
  ]);

export const translateJoke = (position: Animated.Value, direction: MovementDirection) =>
  Animated.timing(position, {
    useNativeDriver: false,
    toValue: direction === 'left' ? translationValue : -translationValue,
    duration: 0,
  });

export const exitRightAnimation = (opacity: Animated.Value, position: Animated.Value) =>
  Animated.parallel([
    Animated.timing(opacity, {
      useNativeDriver: false,
      toValue: 0,
      duration: animationsDuration,
    }),
    Animated.timing(position, {
      useNativeDriver: false,
      toValue: translationValue,
      duration: animationsDuration,
    }),
  ]);
