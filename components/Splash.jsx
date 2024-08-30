// components/Splash.js
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const Splash = ({ scaleAnim }) => {
    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/finalFav.jpg')}
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
