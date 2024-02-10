import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PublishScreen from './screens/PublishScreen';
import ProfileScreen from './screens/ProfileScreen';
import {DetailsScreen} from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Image, Text} from 'react-native';

const MainStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const homeIcon = require('./images/homeIcon.png');
const publishIcon = require('./images/cameraIcon.png');
const profileIcon = require('./images/profileIcon.png');
const selectedHomeIcon = require('./images/selectedHomeIcon.png');
const selectedPublishIcon = require('./images/selectedCameraIcon.png');
const selectedProfileIcon = require('./images/selectedProfileIcon.png');

const LoginStackScreen = () => (
  <LoginStack.Navigator initialRouteName="Login">
    <LoginStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Login Screen' }}
    />
  </LoginStack.Navigator>
);

const HomeStackScreen = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStack.Screen
      name="Details"
      component={DetailsScreen}
      options={{ headerShown: false }}
    />
  </HomeStack.Navigator>
);

const HomeTabScreen = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen
      name="HomeStack"
      component={HomeStackScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <Image
            source={focused ? selectedHomeIcon : homeIcon}
            style={{width: 24, height: 24}}
          />
        ),
        tabBarLabel: ({focused}) => (
          <Text style={{color: focused ? '#5054fc' : '#9c9c9d'}}>Home</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Publish"
      component={PublishScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <Image
            source={focused ? selectedPublishIcon : publishIcon}
            style={{width: 24, height: 24}}
          />
        ),
        tabBarLabel: ({focused}) => (
          <Text style={{color: focused ? '#5054fc' : '#9c9c9d'}}>Publish</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
        tabBarIcon: ({focused}) => (
          <Image
            source={focused ? selectedProfileIcon : profileIcon}
            style={{width: 24, height: 24}}
          />
        ),
        tabBarLabel: ({focused}) => (
          <Text style={{color: focused ? '#5054fc' : '#9c9c9d'}}>Profile</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MainStack.Navigator initialRouteName="HomeTab">
          <MainStack.Screen
            name="LoginStack"
            component={LoginStackScreen}
            options={{ headerShown: false }}
          />
          <MainStack.Screen
            name="HomeTab"
            component={HomeTabScreen}
            options={{ headerShown: false }}
          />
        </MainStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;