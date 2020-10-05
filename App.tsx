import * as Sharing from 'expo-sharing';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Image, ImageBackground, View, Animated, TextInput, Dimensions } from 'react-native';
import { captureScreen } from 'react-native-view-shot';
import googlePlay from './assets/google-play.png';
import {
    displayLastJoke,
    displayNextJoke,
    displayPreviousJoke,
    isFirstJoke,
    isLastJoke,
    loadFirstJoke,
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
import { getRandomTheme } from './src/themes';
import {
    Joke,
    Limits,
    MovementDirection,
    NumericDictionary,
    State,
    StateSetters,
    WrappedValue
} from './src/types';
import { Buttons } from './src/components/buttons';
import { Searcher } from './src/components/searcher';
import { JokesContainer } from './src/components/jokes-container';

const initialTheme = getRandomTheme();

const dimensions = Dimensions.get('window');
const bannerWidth = dimensions.width;
const bannerHeight = 54;

export default function App() {
    const [currentError, setCurrentError] = useState<WrappedValue<string>>({
        value: undefined
    });
    const [direction, setDirection] = useState<MovementDirection>('left');
    const [filter, setFilter] = useState('');
    const [isSearcherVisible, setIsSearcherVisible] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [jokeIndex, setJokeIndex] = useState(-1);
    const [jokes, setJokes] = useState<Joke[]>([]);
    const [limits, setLimits] = useState<Limits>({ oldest: -1, newest: -1 });
    const [searcherOffsets, setSearcherOffsets] = useState<NumericDictionary>({});
    const [theme, setTheme] = useState(initialTheme);

    const state: State = {
        currentError,
        direction,
        filter,
        jokeIndex,
        jokes,
        limits,
        searcherOffsets,
        theme
    };

    const stateSetters: StateSetters = {
        setCurrentError,
        setDirection,
        setFilter,
        setIsSearcherVisible,
        setJokeIndex,
        setJokes,
        setLimits,
        setSearcherOffsets,
        setTheme
    };

    // When application starts, the jokes limits are fetched and random joke is loaded
    useEffect(() => {
        loadFirstJoke(state, stateSetters);
    }, []);

    const opacity = useMemo(() => new Animated.Value(0), []);
    const position = useMemo(() => new Animated.Value(0), []);
    const inputReference = useRef<TextInput>(null);

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
                inputReference.current?.blur();
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
        if (!isSearcherVisible) {
            // Set immediate is required so the input element is inserted in the DOM
            setImmediate(() => {
                inputReference.current?.focus();
            });
        }
    };

    const clearSearchHandler = () => {
        setFilter('');
        setIsSearcherVisible(false);
    };

    const displayLastJokeHandler = () => {
        if (!isLastJoke(jokes, jokeIndex)) {
            exitLeftAnimation(opacity, position).start(() => {
                displayLastJoke(state, stateSetters);
            });
        }
    };

    const shareHandler = () => {
        Sharing.isAvailableAsync()
            .then((isShareAvailable) => {
                if (isShareAvailable) {
                    setIsSharing(true);
                    // Setting a timeout so the bromuro banner is loaded
                    setTimeout(() => {
                        captureScreen({
                            format: 'png',
                            quality: 0.8
                        })
                            .then((uri) => {
                                Sharing.shareAsync(uri);
                            })
                            .catch(() => undefined) // Tough luck!;
                            .finally(() => {
                                setIsSharing(false);
                            });
                    }, 250);
                }
            })
            .catch(() => undefined);
    };

    return (
        <ImageBackground source={theme.backgroundImage} style={theme.backgroundStyle}>
            <View style={{ padding: 16, flex: 1, overflow: 'hidden' }}>
                <JokesContainer
                    currentError={currentError}
                    jokeIndex={jokeIndex}
                    jokes={jokes}
                    opacity={opacity}
                    position={position}
                    theme={theme}
                />
                {!isSharing && (
                    <View>
                        <Buttons
                            displaySearchIcon={Boolean(filter) && isLastJoke(jokes, jokeIndex)}
                            isFirstJoke={isFirstJoke(jokeIndex)}
                            isSearcherVisible={isSearcherVisible}
                            nextHandler={nextHandler}
                            previousHandler={previousHandler}
                            searchHandler={searchHandler}
                            shareHandler={shareHandler}
                            theme={theme}
                        />
                        {isSearcherVisible && (
                            <Searcher
                                clearSearchHandler={clearSearchHandler}
                                displayLastJokeHandler={displayLastJokeHandler}
                                filter={filter}
                                reference={inputReference}
                                setFilter={setFilter}
                                theme={theme}
                            />
                        )}
                    </View>
                )}
            </View>
            {isSharing && (
                <Image
                    source={googlePlay}
                    width={bannerWidth}
                    height={bannerHeight}
                    style={{ width: bannerWidth, height: bannerHeight, resizeMode: 'contain' }}
                />
            )}
        </ImageBackground>
    );
}
