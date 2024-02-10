import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import { DetailsScreen } from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';

const MainStack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const LoginStackScreen = () => (
  <LoginStack.Navigator initialRouteName="Login">
    <LoginStack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Login Screen' }}
    />
    <LoginStack.Screen name="Details" component={DetailsScreen} />
  </LoginStack.Navigator>
);

const HomeStackScreen = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Home Screen' }}
    />
    <HomeStack.Screen name="Details" component={DetailsScreen} />
  </HomeStack.Navigator>
);

function App() {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="Login">
        <MainStack.Screen
          name="LoginStack"
          component={LoginStackScreen}
          options={{ headerShown: false }}
        />
        <MainStack.Screen
          name="HomeStack"
          component={HomeStackScreen}
          options={{ headerShown: false }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

export default App;