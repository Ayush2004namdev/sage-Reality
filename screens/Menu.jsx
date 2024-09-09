import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomDrawer from '../components/BottomDrawer';
import { setIsMenuOpen } from '../redux/slices/misc';

const { width, height } = Dimensions.get('window');

const Menu = () => {
  const { isMenuOpen } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const handleMenuOnPress = () => {
    dispatch(setIsMenuOpen(!isMenuOpen));
  };

  const handleOnMenuClose = () => {
    dispatch(setIsMenuOpen(false));
  };

  const handleMenuClose = (e) => {
    e.preventDefault();
    dispatch(setIsMenuOpen(false));
  }

  return (
    <>
      {isMenuOpen && (
        <Pressable onPress={handleMenuClose} style={styles.drawerContainer}>
          <BottomDrawer isVisible={isMenuOpen} onClose={handleOnMenuClose} />
        </Pressable>
      )}
      <Pressable onPress={handleMenuOnPress} style={styles.menuIcon}>
        <Image source={require('../assets/MenuHam.png')} style={{
          height:24,
          width:27,
          paddingHorizontal:10,
        }} />
        {/* <Ionicons name="menu" style={{
          marginBottom:0,
        }} size={30} color="white" /> */}
        <Text style={{
          color: 'white',
          fontSize: 10,
        }}>Menu</Text>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  menuIcon: {
    position: 'absolute',
    bottom: -3,
    right: 10,
    padding: 10,
    borderRadius: 50,
    zIndex:1,
    display:'flex',
    alignItems:'center',
  },
  drawerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width, 
    height: height, 
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
    zIndex: 1000, 
  },
});

export default Menu;
