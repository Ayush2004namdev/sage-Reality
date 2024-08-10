// components/Splash.js
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Splash = ({ scaleAnim }) => {
    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/logo.png')}
                style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
});

export default Splash;
