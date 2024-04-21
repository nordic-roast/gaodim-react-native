// MainApp.jsx
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import SplashScreen from "../views/SplashScreen";
import LoginScreen from '../views/LoginScreen';
import RegistrationScreen from '../views/RegistrationScreen';
import HomeScreen from "../views/HomeScreen";
import ImageSelect from "../views/ImageSelect";
import HistoryScreen from "../views/HistoryScreen"; 
import { Ionicons } from '@expo/vector-icons';

import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserLoggedIn(true);
      } else {
        setUserLoggedIn(false);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Splash"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {userLoggedIn && (
        <>
          <Tab.Screen name="Home" component={HomeScreen} /> 
        </>
      )}
      <Tab.Screen name="Camera" component={ImageSelect} />
      {userLoggedIn && (
        <> 
          <Tab.Screen name="History" component={HistoryScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default MainApp;