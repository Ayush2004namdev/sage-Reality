import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useDispatch } from 'react-redux';
import { setIsMenuOpen, setLogoutPopup, setShowPopupDialog, toggleAdd } from '../redux/slices/misc';
import { logout } from '../redux/slices/user';

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
    // dispatch(setIsMenuOpen(false));
    // dispatch(toggleAdd(false));
    // dispatch(logout());
  }

  const menuItems = [
    { name: 'Set Monthly Target', icon: require('../assets/Target.png'), route: 'SetMonthlyTarget' },
    { name: 'Corporate Visit', icon: require('../assets/CorpVisit.png'), route: 'CorpVisit' },
    { name: 'Sage Mitra Follow Up', icon: require('../assets/SAGEMF.png'), route: 'SageMF' },
    { name: 'Home Visit', icon: require('../assets/HomeVisit.png'), route: 'HomeVisit' },
    { name: 'Event', icon: require('../assets/Events.png'), route: 'Event' },
    { name: 'Client Site Visit', icon: require('../assets/ClientSiteVisit.png'), route: 'ClientSiteVisit' },
    { name: 'Admission Done', icon: require('../assets/Admission.png'), route: 'Admission' },
    { name: 'IP Done', icon: require('../assets/IP.png'), route: 'IpDone' }
  ];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(toggleAdd(false));
  },[])

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {menuItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.menuItem} onPress={() => { navigation.navigate(item.route); onClose(); }}>
          <Image source={item.icon} style={{ width: 28, height: 28 }} />
          {/* <Ionicons name={item.icon} size={24} color="black" /> */}
          <Text style={styles.menuText}>{item.name}</Text>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
              <Image source={require('../assets/ArrowIcon.png')} style={{ width: 24, height: 24, }} />
          </View>
        </TouchableOpacity>
      ))}
          <TouchableOpacity style={styles.menuItem} onPress={ handleLogOut}>
          <Image source={require('../assets/Logout.png')} style={{ width: 24, height: 24 }} />
          <Text style={styles.menuText}>Logout</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>CLOSE</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 'auto',
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    marginLeft: 15,
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
});

export default BottomDrawer;
