import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';

const Loader = ({back}) => {
  return (
    <View style={styles.container}>
      <AnimatedLoader
        visible={true}
        overlayColor={back ?"rgba(255,255,255,1)" : "rgba(255,255,255,0.75)"}
        source={require('../assets/loader.json')} 
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
    backgroundColor: '#fff', 
  },
  lottie: {
    width: 400,  
    height: 400, 
  },
});

export default Loader;
