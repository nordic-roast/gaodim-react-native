// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainApp from './navigation/MainApp'; // Adjust the path as necessary

export default function App() {
  return (
    <NavigationContainer>
      <MainApp />
    </NavigationContainer>
  );
}