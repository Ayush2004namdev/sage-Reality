import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, Text } from 'react-native';

const TabBarDashboardButton = (r) => {
    const {navigate} = useNavigation();
  return (
    <Pressable onPress={() => navigate('Dashboard')} style={{
        position:'absolute',
        bottom:5,
        left:10,
        display:'flex',
        alignItems:'center',
    }}>
      <Image source={require('../assets/DashboardIco.png')} style={{
        width: 35,
        height: 35,
      }} />
      <Text style={{
        color:'white',
        fontSize:10,
      }}>Dashboard</Text>
    </Pressable>
  )
}

export default TabBarDashboardButton