import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import PublishScreen from './screens/PublishScreen';
import ProfileScreen from './screens/ProfileScreen';
import { DetailsScreen } from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const MainStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

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
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Publish"
      component={PublishScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerShown: false }}
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