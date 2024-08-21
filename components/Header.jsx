import React from 'react';
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { blue } from '../constants';

const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
const Header = () => {
  return (
    <>
    <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
    </SafeAreaView>
      <View style={styles.headerContainer}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
          />
        <Text style={styles.title}>Sage Realty</Text>
      </View>
      </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    height: statusBarHeight-5,
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
