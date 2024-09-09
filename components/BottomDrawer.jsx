import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setIsMenuOpen, setLogoutPopup, toggleAdd } from '../redux/slices/misc';

const { height } = Dimensions.get('window');

const BottomDrawer = ({ isVisible, onClose }) => {
  const navigation = useNavigation();
  const translateY = useSharedValue(isVisible ? 0 : height);

  useEffect(() => {
    translateY.value = withSpring(isVisible ? 0 : height, {
      damping: 10,
      stiffness: 100,
      mass: 0.5,
    });
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleLogOut = () => {
    dispatch(setLogoutPopup(true));
    dispatch(setIsMenuOpen(false));
    navigation.navigate('Dashboard');
  };

  const menuItems = [
    { name: 'Set Monthly Target', icon: require('../assets/Target.png'), route: 'SetMonthlyTarget' },
    { name: 'Sage Mitra Follow Up', icon: require('../assets/SAGEMF.png'), route: 'SageMF' },
    { name: 'Corporate Visit', icon: require('../assets/CorpVisit.png'), route: 'CorpVisit' },
    { name: 'Home Visit', icon: require('../assets/HomeVisit.png'), route: 'HomeVisit' },
    { name: 'Site Visit', icon: require('../assets/ClientSiteVisit.png'), route: 'ClientSiteVisit' },
    { name: 'Event', icon: require('../assets/Events.png'), route: 'Event' },
      { name: 'Admission ', icon: require('../assets/Admission.png'), route: 'Admission' },
    { name: 'IP ', icon: require('../assets/IP.png'), route: 'IpDone' }
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleAdd(false));
  }, []);

  return (
    <View style={styles.overlay}>
      {isVisible && <Pressable style={styles.fullscreen} onPress={onClose} />}
      <Animated.View style={[styles.container, animatedStyle]}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => { navigation.navigate(item.route); onClose(); }}>
              <Image source={item.icon} style={{ width: 36, height: 36 }} />
              <Text style={styles.menuText}>{item.name}</Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <Image source={require('../assets/ArrowIcon.png')} style={{ width: 24, height: 24 }} />
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogOut}>
            <Image source={require('../assets/Logout.png')} style={{ width: 36, height: 36 }} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>CLOSE</Text>
          </TouchableOpacity>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    justifyContent: 'flex-end',
    zIndex: 1000, // Ensure it overlays all other content
  },
  fullscreen: {
    ...StyleSheet.absoluteFillObject, // Captures all touch events
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  container: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 15,    
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#007BFF',
  },
});

export default BottomDrawer;
