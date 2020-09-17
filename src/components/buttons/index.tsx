import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Theme } from '../../types';
import { NextButton } from './next';
import { PreviousButton } from './previous';
import { SearchButton } from './search';

export interface ButtonsProps {
    displaySearchIcon: boolean;
    isFirstJoke: boolean;
    isSearcherVisible: boolean;
    nextHandler: () => void;
    previousHandler: () => void;
    searchHandler: () => void;
    theme: Theme;
}

export const Buttons: React.FC<ButtonsProps> = (props) => {
    const previousButtonStyle = getButtonStyle(props.theme, !props.isFirstJoke);
    const searchButtonStyle = getButtonStyle(props.theme, true, props.isSearcherVisible);
    const nextButtonStyle = getButtonStyle(props.theme);

    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }}
        >
            <PreviousButton
                buttonStyle={previousButtonStyle.button}
                fillColor={previousButtonStyle.path.color}
                onPress={props.previousHandler}
            />
            <SearchButton
                buttonStyle={searchButtonStyle.button}
                fillColor={searchButtonStyle.path.color}
                onPress={props.searchHandler}
            />
            <NextButton
                buttonStyle={nextButtonStyle.button}
                displaySearchIcon={props.displaySearchIcon}
                fillColor={nextButtonStyle.path.color}
                onPress={props.nextHandler}
            />
        </View>
    );
};

export const getButtonStyle = (theme: Theme, isEnabled = true, isActive = false) => {
    return StyleSheet.create({
        button: {
            marginVertical: 16,
            marginHorizontal: 8,
            padding: 16,
            backgroundColor: isEnabled
                ? isActive
                    ? theme.sentenceColor
                    : '#fff'
                : 'rgba(255, 255, 255, 0.5)'
        },
        path: { color: isActive && isEnabled ? '#fff' : theme.sentenceColor }
    });
};
