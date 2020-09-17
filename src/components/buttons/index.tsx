import React from 'react';
import { View } from 'react-native';
import { allStyles, getButtonStyle } from '../../styles';
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
        <View style={allStyles.buttons}>
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
