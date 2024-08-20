import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

const Loader = ({back}) => {
  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={true}
        overlayColor={back ?"rgba(255,255,255,1)" : "rgba(255,255,255,0.75)"}
        source={require('../assets/loader.json')} // Update with your Lottie file path
        animationStyle={styles.lottie}
        speed={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Change to your desired background color
  },
  lottie: {
    width: 400,  // Adjust size as needed
    height: 400, // Adjust size as needed
  },
});

export default Loader;
