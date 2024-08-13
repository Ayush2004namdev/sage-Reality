import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAdd } from '../redux/slices/misc';
import { useNavigation } from '@react-navigation/native';
import { blue, yellow } from '../constants';

const Add = () => {
  const navigator = useNavigation();
  
  const {isAddOpen } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const handlePress = () => {
    dispatch(toggleAdd(!isAddOpen));
  };

  const handleNavigation = (screen) => {
    dispatch(toggleAdd(false));
    navigator.navigate(screen);
  }

  return (
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        {/* <View style={styles.wave}></View> */}
      </View>
      <Pressable onPress={() => handleNavigation('HomeVisit')} style={[styles.secondaryButton, isAddOpen && styles.homeButtonOpen]}>
        <Ionicons name='home-outline' size={24} color='#FFF' />
      </Pressable>
      <Pressable onPress={() => handleNavigation('CorpVisit')} style={[styles.secondaryButton, isAddOpen && styles.corpButtonOpen]}>
        <Ionicons name='business-outline' size={24} color='#FFF' />
      </Pressable>
      <Pressable onPress={() => handleNavigation('SageMF')} style={[styles.secondaryButton, isAddOpen && styles.smfButtonOpen]}>
        <Ionicons name='people-outline' size={24} color='#FFF' />
      </Pressable>
      <TouchableOpacity onPress={handlePress} style={[styles.button, isAddOpen && styles.buttonOpen]}>
        <FontAwesome5 name='plus' size={30} color='#FFF' />
      </TouchableOpacity>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  waveContainer: {
    position: 'absolute',
    width: 100,
    height: 39.5, 
    bottom: 21,
    right: 145,
    overflow: 'hidden',
  },
  wave: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 2,
    // left: 0,
    // transform: [{ rotate: '0deg' }],
  },
  button: {
    backgroundColor: '#ddbf09',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    position: 'absolute',
    bottom:25,
    shadowColor: yellow,
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 5,
    borderWidth: 3,
    borderColor: '#FFF',
    zIndex: 999,
    transition: 'transform',
    transitionDuration: '2s',
    transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
  buttonOpen: {
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#003068',
    shadowColor: blue,
    opacity: 1,
  },
  secondaryButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    shadowColor: yellow,
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 5,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddbf09',
    opacity: 0,
    transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-in-out',
  },
  homeButtonOpen: {
    transform: [{ translateX: -80 }, { translateY: -100 }],
    opacity: 1,
  },
  corpButtonOpen: {
    transform: [{ translateY: -150 }],
    opacity: 1,
  },
  smfButtonOpen: {
    transform: [{ translateX: 80 }, { translateY: -100 }],
    opacity: 1,
  },
});
