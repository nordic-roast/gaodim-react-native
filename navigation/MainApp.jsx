// MainApp.jsx
import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "../views/SplashScreen";
import LoginScreen from "../views/LoginScreen";
import RegisterScreen from "../views/RegisterScreen";
import HomeScreen from "../views/HomeScreen";
import ImageSelect from "../views/ImageSelect";
import HistoryScreen from "../views/HistoryScreen";
import AppealScreen from "../views/AppealScreen";

import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Component to hold the bottom tabs
const BottomTabNavigator = () => {
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

  if (userLoggedIn) {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Image" component={ImageSelect} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Image" component={ImageSelect} />
      </Tab.Navigator>
    );
  }
};

// Main App Component
const MainApp = () => {
  return (
    <Stack.Navigator initialRouteName="Appeal">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appeal"
        component={AppealScreen}
        options={{ headerShown: false }}
      />
      {/* The main tab navigator becomes a screen in the stack navigator */}
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainApp;
