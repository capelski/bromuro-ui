import React from 'react';
import { TouchableOpacity, StyleProp } from 'react-native';
import Svg from 'react-native-svg';

interface ButtonCommonProps {
    buttonStyle: StyleProp<any>;
    onPress: () => void;
}

interface ButtonBaseProps extends ButtonCommonProps {
    viewBox: string;
}

export interface ButtonProps extends ButtonCommonProps {
    fillColor: string;
}

export const Button: React.FC<ButtonBaseProps> = (props) => (
    <TouchableOpacity onPress={props.onPress} style={props.buttonStyle}>
        <Svg height={32} width={32} viewBox={props.viewBox}>
            {props.children}
        </Svg>
    </TouchableOpacity>
);
