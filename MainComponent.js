import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, Easing, SafeAreaView, AppState, TouchableWithoutFeedback, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Header from './components/Header';
import Splash from './components/Splash';
import store from './redux/store';
import Login from './screens/Login';
import TabNavigator from './Tabnavigator';
import { login, logout } from './redux/slices/user';

const INACTIVITY_TIMEOUT = 48 * 60 * 60 * 1000; // 48 hours

const MainComp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [inactiveTimer, setInactiveTimer] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Store session in AsyncStorage
  const storeSession = async (userData) => {
    const sessionData = {
      ...userData,
      sessionExpiry: Date.now() + INACTIVITY_TIMEOUT, 
    };
    await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
  };

  // Get session from AsyncStorage
  const getSession = async () => {
    try {
      const sessionData = await AsyncStorage.getItem('userSession');
      if (sessionData) {
        const parsedData = JSON.parse(sessionData);
        if (Date.now() > parsedData.sessionExpiry) {
          dispatch(logout()); 
        } else {
          // dispatch(logout()); 
          dispatch(login(parsedData))
          setUserLoggedIn(parsedData);
          resetInactivityTimer(); 
        }
      }
    } catch (error) {
      console.error('Error retrieving session:', error);
    }
  };

  useEffect(() => {
    // Zoom animations for splash screen
    const zoomInOut = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    const zoomInFull = () => {
      Animated.timing(scaleAnim, {
        toValue: 10,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setIsLoading(false);
      });
    };

    zoomInOut();

    const timer = setTimeout(() => {
      zoomInFull();
      getSession(); // Check session on app load
    }, 4000);

    return () => clearTimeout(timer);
  }, [scaleAnim]);

  const resetInactivityTimer = useCallback(() => {
    if (inactiveTimer) clearTimeout(inactiveTimer);

    const newTimer = setTimeout(() => {
      dispatch(logout());
      AsyncStorage.removeItem('userSession'); // Clear session if inactive
    }, INACTIVITY_TIMEOUT);

    setInactiveTimer(newTimer);
  }, [inactiveTimer, dispatch]);

  // Listen for app state changes to reset inactivity timer
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        resetInactivityTimer();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [resetInactivityTimer]);

  // Store user session when logged in
  useEffect(() => {
    if (user?.access) {
      storeSession(user); // Store session in AsyncStorage
      resetInactivityTimer();
    }
  }, [user]);

  // Render initial screen based on session status
  const renderInitialScreen = (store) => {
    if (!user?.access) {
      return <Login user={user.user} dispatch={store.dispatch} setUserLoggedIn={setUserLoggedIn} />;
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={resetInactivityTimer}>
            <View style={{ flex: 1 }}>
              <Header />
              <TabNavigator />
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      );
    }
  };

  return isLoading ? <Splash scaleAnim={scaleAnim} /> : <NavigationContainer>{renderInitialScreen(store)}</NavigationContainer>;
};

export default MainComp;
