import React from 'react';
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { blue } from '../constants';
import { useSelector } from 'react-redux';

const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 0;
const Header = () => {

  const {user} = useSelector(state => state.user);
  console.log(user.user.first_name);

  return (
    <>
    <SafeAreaView style={styles.safeArea}>
    <StatusBar barStyle={'light-content'} backgroundColor={'black'} />
    </SafeAreaView>
      {/* <View style={styles.headerContainer}>
      <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
      }}>
        <Image
          source={require('../assets/logo.png')} 
          style={styles.logo}
          />
          <Text style={styles.title}>Sage Realty</Text>
          </View>
          <Text style={{
              // textAlign: 'right',
              color: 'white',
              backgroundColor:'red',
              width: '100%',
            }}>{user.user.first_name}</Text>
           
      </View> */}

      <View style={{
        height: 60,
        backgroundColor: blue,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image 
        source={require('../assets/logo.png')}
        style={{
          width: 40,
          height: 40,
          marginLeft: 10,
        }}
        />
        <Text style={{
          color: 'white',
          fontSize: 20,
          fontWeight: 'bold',
        }}>Sage Realty</Text>
          </View>
          <Text style={{
            color: 'white',
            marginRight: 10,
          }}>{user.user.first_name}</Text>
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
    justifyContent: 'space-between',
    height: 60,
    backgroundColor: blue, 
    paddingHorizontal: 10,
    width: '100%',
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
