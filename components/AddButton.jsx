import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View,Dimensions, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { blue, yellow } from '../constants';
import { toggleAdd } from '../redux/slices/misc';
import { BlurView } from 'expo-blur';

const {height,width} = Dimensions.get('screen');

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

  const handleCloseBackdrop = () => {
    dispatch(toggleAdd(false));
  }

  return (
    <>
     
    <View style={styles.container}>
      <View style={styles.waveContainer}>
      </View>
      
      <View style={[styles.secondaryButton, isAddOpen && styles.corpButtonOpen]}>
      <Pressable onPress={() => handleNavigation('CorpVisit')} style={[styles.iconButton]}>
      {/* <Image source={require('../assets/CorpVisit.png')} style={ {width:34 , height:34 }} /> */}
        <Ionicons name='business-outline' size={24} color={blue} />
      </Pressable>
      <Text   style={styles.iconLabel}>Corporate Visit</Text>
      </View>

      <View style={[styles.secondaryButton, isAddOpen && styles.homeButtonOpen]}>
      <Pressable onPress={() => handleNavigation('HomeVisit')} style={[styles.iconButton]}>
      {/* <Image source={require('../assets/HomeVisit.png')} style={ {width:34 , height:34 , objectFit:'contain' }} /> */}
        <Ionicons name='home-outline' size={24} color={blue} />
      </Pressable>
      <Text  style={styles.iconLabel}>Home Visit</Text>
      </View>


      <View style={[styles.secondaryButton, isAddOpen && styles.smfButtonOpen]}>
      <Pressable onPress={() => handleNavigation('SageMF')} style={[styles.iconButton]}>
      {/* <Image source={require('../assets/SAGEMF.png')} style={{width:34 , height:34 }} /> */}
        <Ionicons name='people-outline' size={24} color={blue} />
      </Pressable>
      <Text style={styles.iconLabel}>Sage Mitra F/W</Text>
      </View>

      <TouchableOpacity onPress={handlePress} style={[styles.button, isAddOpen && styles.buttonOpen]}>
        <FontAwesome5 name='plus' size={30} color='#FFF' />
      </TouchableOpacity>
    </View>
    {isAddOpen && (
  <Pressable
    style={{
      width: width+100,
      height: height + 100,
      transform: [{ translateY: -height }],
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 22,
      justifyContent: 'center', 
      alignItems: 'center',
      marginLeft: -50,
    }}
    onPress={handleCloseBackdrop}
    // pointerEvents='auto'
  >
    <BlurView intensity={80} tint="dark" style={styles.blurView}>
    </BlurView>
  </Pressable>
)}
    </>

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
    // backgroundColor: '#F6F5F5',
    backgroundColor: '#ddbf09',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 40,
    position: 'absolute',
    bottom:31,
    // shadowColor: yellow,
    // shadowRadius: 5,
    // elevation: 5,
    // shadowOffset: { height: 10 },
    // shadowOpacity: 5,
    borderWidth: 8,
    borderColor: '#F6F5F5',
    // borderColor:'blue',
    zIndex: 999,
    transition: 'transform',
    transitionDuration: '2s',
    transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
  buttonOpen: {
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#003068',
    shadowColor: blue,
    borderColor: '#F6F5F5',
    opacity: 1,
  },
  secondaryButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    zIndex: 999,
    transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-in-out',
  },
  iconButton : {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddbf09',
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 5,
    elevation: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 5,
    marginBottom:5,
  },
  homeButtonOpen: {
    transform: [{ translateY: -150 }],
    opacity: 1,
  },
  corpButtonOpen: {
    transform: [{ translateX: -80 }, { translateY: -100 }],
    opacity: 1,
    
  },
  smfButtonOpen: {
    transform: [{ translateX: 80 }, { translateY: -100 }],
    opacity: 1,
  },
  iconLabel:{
    fontWeight: '500',
    fontSize: 12,
    color: 'white',
  },
  blurView: {
    width: '100%', // Adjust width as needed
    height: '100%', // Adjust height as needed
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)', // Subtle white border
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent background for glass effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
  },
});
