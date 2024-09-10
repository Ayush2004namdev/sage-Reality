import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import Add from './components/AddButton';
import Header from './components/Header';
import Splash from './components/Splash';
import TabBarDashboardButton from './components/TabBarDashboardButton';
import { blue } from './constants';
import store from './redux/store';
import Admission from './screens/Admission';
import CorpVisit from './screens/CorpVisit';
import Dashboard from './screens/Dashboard';
import Details from './screens/Details';
import Event from './screens/Event';
import HomeVisit from './screens/HomeVisit';
import IPDone from './screens/IPDone';
import Login from './screens/Login'; // Import the Login component
import Menu from './screens/Menu';
import SageMitraFollowUp from './screens/SageMitraFollowUp';
import SetTarget from './screens/SetTarget';
import SiteVisit from './screens/SiteVisit';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      return {
        tabBarStyle: {
          backgroundColor: blue,
          paddingTop: 10,
          height: 60,
          position: 'absolute',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20
        },
        tabBarLabel: '',
        headerShown:false,
        tabBarActiveTintColor: 'yellow',
        tabBarInactiveTintColor: 'white',
        tabBarIcon: ({ focused, size }) => {
          let icon;
          if (route.name === 'Dashboard') {
            icon = focused ? 'home' : 'home-outline';
          }
          if (route.name === 'Menu') {
            icon = focused ? 'grid' : 'grid-outline';
          }

          return <Ionicons name={icon} size={size} color={'black'} />;
        },
      };
    }}
  >
    <Tab.Screen
      name='Dashboard'
      options={{
        tabBarButton: (props) => <TabBarDashboardButton {...props} />,
      }}
      component={Dashboard}
    />
    <Tab.Screen
      name='Add'
      component={Dashboard}
      options={{
        tabBarButton: (props) => <Add {...props} />,
      }}
    />
    <Tab.Screen
      name='SageMF'
      options={{
        tabBarButton: () => null,
        tabBarVisible: false,
      }}
      component={SageMitraFollowUp}
    />
    <Tab.Screen
      name='Details'
      options={{
        tabBarButton: () => null,
        tabBarVisible: false,
      }}
      component={Details}
    />
    <Tab.Screen
        name='ClientSiteVisit'
      options={{
        tabBarButton: () => null,
        tabBarVisible: false,
      }}
      component={SiteVisit}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='IpDone'
      component={IPDone}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='SetMonthlyTarget'
      component={SetTarget}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='HomeVisit'
      component={HomeVisit}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='Event'
      component={Event}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='Admission'
      component={Admission}
    />
    <Tab.Screen
      options={{
        tabBarButton: () => null,
      }}
      name='CorpVisit'
      component={CorpVisit}
    />
    <Tab.Screen
      name='Menu'
      component={Menu}
      options={{
        tabBarButton: (props) => <Menu {...props} />,
      }}
    />
  </Tab.Navigator>
);

const MainComp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [userLoggedIn , setUserLoggedIn] = useState(null); 

  useEffect(() => {
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
    }, 4000);

    return () => clearTimeout(timer);
  }, [scaleAnim]);

  const {user} = useSelector((state) => state.user);
  const renderInitialScreen = (store) => {
    if (!user?.access){
      return <Login user={user.user} dispatch={store.dispatch} setUserLoggedIn={setUserLoggedIn}/>; 
    } else {
      return (
        <>
        <SafeAreaView style={{
          flex:1,
        }}>
          <Header />
          <TabNavigator/>
        </SafeAreaView>
        </>
      );
    }
  };

  return isLoading ? (
    <Splash scaleAnim={scaleAnim} />
  ) : (
      <NavigationContainer>{renderInitialScreen(store)}</NavigationContainer>
  );
};

export default MainComp;
