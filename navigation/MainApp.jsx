// MainApp.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../views/SplashScreen';
import LoginScreen from '../views/LoginScreen';
import RegisterScreen from '../views/RegisterScreen';
import HomeScreen from '../views/HomeScreen'; // Your actual HomeScreen component
import CameraScreen from '../views/CameraScreen'; // Your actual CameraScreen component
import HistoryScreen from '../views/HistoryScreen'; // Your actual HistoryScreen component

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Component to hold the bottom tabs
const BottomTabNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Camera" component={CameraScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
    );
};

// Main App Component
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
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ headerShown: false }}
            />
            {/* The main tab navigator becomes a screen in the stack navigator */}
            <Stack.Screen
                name="Main"
                component={BottomTabNavigator}
                options={{ headerShown: false }} // You can set this to true if you want a header
            />
        </Stack.Navigator>
    );
};

export default MainApp;
