import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Pressable } from 'react-native';

const TabBarDashboardButton = (r) => {
    const {navigate} = useNavigation();
  return (
    <Pressable onPress={() => navigate('Dashboard')} style={{
        position:'absolute',
        top:2,
        left:20
    }}>
        <Ionicons name='home' size={30} color='white' />
    </Pressable>
  )
}

export default TabBarDashboardButton