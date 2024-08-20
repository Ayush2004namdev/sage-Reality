import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const Loading = ({back}) => {

  return (
    <View style={[styles.overlay , {backgroundColor : back ? 'white' : 'rgba(0, 0, 0, 0.5)'}]}>
        <Image source={require('../assets/loading-anim.gif')} style={{ width: 100, height: 100 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    top: 0,
    left: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: '#4085d6',
    borderTopColor: 'transparent',
    position: 'absolute',
  },
  circleSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#4085d6',
    borderTopColor: 'transparent',
    position: 'absolute',
  },
  circleSmaller: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#4085d6',
    borderTopColor: 'transparent',
    position: 'absolute',
  },
});

export default Loading;
