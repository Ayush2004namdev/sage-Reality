import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { blue } from '../constants';

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="black" />
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
        />
        <Text style={styles.title}>Sage Realty</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop:30,
    backgroundColor: 'black', 
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
    height: 60,
    backgroundColor: blue, 
    paddingHorizontal: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
