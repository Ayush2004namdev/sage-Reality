// TabBarBackground.js
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const TabBarBackground = () => (
  <ImageBackground
    source={require('../assets/svgBottom.svg')} // Update this path
    style={styles.background}
    resizeMode="cover"
  >
    <View style={styles.overlay} />
  </ImageBackground>
);

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },
});

export default TabBarBackground;
