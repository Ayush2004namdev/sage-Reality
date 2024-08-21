import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable } from 'react-native';

const TabBarDashboardButton = (r) => {
    const {navigate} = useNavigation();
  return (
    <Pressable onPress={() => navigate('Dashboard')} style={{
        position:'absolute',
        bottom:5,
        left:20
    }}>
      <Image source={require('../assets/DashboardIco.png')} style={{
        width: 45,
        height: 45,
      }} />
        {/* <Ionicons name='home' size={30} color='white' /> */}
    </Pressable>
  )
}

export default TabBarDashboardButton