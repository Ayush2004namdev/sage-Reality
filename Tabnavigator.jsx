import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Add from './components/AddButton';
import TabBarDashboardButton from './components/TabBarDashboardButton';
import { blue } from './constants';
import Admission from './screens/Admission';
import CorpVisit from './screens/CorpVisit';
import Dashboard from './screens/Dashboard';
import Details from './screens/Details';
import Event from './screens/Event';
import HomeVisit from './screens/HomeVisit';
import IPDone from './screens/IPDone';
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

  export default TabNavigator