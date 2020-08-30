import { StyleSheet } from 'react-native';
import { Theme } from './themes';

const buttonStyle = {
    marginVertical: 16,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    padding: 16
};

const sentenceBaseStyle = {
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginVertical: 8,
    fontSize: 24,
    fontWeight: 'bold' as 'bold',
    lineHeight: 28
};

export const getButtonStyle = (theme: Theme, isEnabled = true) => {
    return StyleSheet.create({
        button: {
            ...buttonStyle,
            backgroundColor: isEnabled ? buttonStyle.backgroundColor : 'rgba(255, 255, 255, 0.5)'
        },
        path: { color: theme.sentenceColor }
    });
};

export const getSentenceStyle = (theme: Theme) => {
    return StyleSheet.create({
        odd: {
            ...sentenceBaseStyle,
            color: theme.sentenceColor,
            backgroundColor: '#fff',
            transform: [{ rotate: '-2deg' }]
        },
        even: {
            ...sentenceBaseStyle,
            backgroundColor: theme.sentenceColor,
            color: '#fff',
            transform: [{ rotate: '2deg' }]
        }
    });
};

export const allStyles = StyleSheet.create({
    container: {
        padding: 16,
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
    },
    jokesViewport: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
