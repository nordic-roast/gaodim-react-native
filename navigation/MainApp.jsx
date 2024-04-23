// MainApp.jsx
import React, { createContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "../views/SplashScreen";
import LoginScreen from "../views/LoginScreen";
import RegistrationScreen from "../views/RegisterScreen";
import HomeScreen from "../views/HomeScreen";
import ImageSelect from "../views/ImageSelect";
import HistoryScreen from "../views/HistoryScreen";
import AppealScreen from "../views/HistoryScreen";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Splash"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Camera") {
            iconName = focused ? "camera" : "camera-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {isLoggedIn ? (
        <>
          {/* Logged in */}
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Camera" component={ImageSelect} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </>
      ) : (
        <>
          {/* Not logged in */}
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Camera" component={ImageSelect} />
        </>
      )}
    </Tab.Navigator>
  );
};

const MainApp = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
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
        component={RegistrationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Appeal"
        component={AppealScreen}
        options={{ headerShown: false }}
      />
      {/* Once logged in, the Main tab navigator is active */}
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainApp;
