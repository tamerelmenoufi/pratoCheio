import React from 'react'
import { StatusBar } from 'expo-status-bar'
import {NavigationContainer} from '@react-navigation/native'
import Router from './src/router';
import AuthProvider from './src/contexts/auth.js';

export default function App() {
  return (
      <NavigationContainer>
        <StatusBar backgroundColor='#1daf4c' barStyle="light-content" />
          <AuthProvider>
              <Router />
          </AuthProvider>
      </NavigationContainer>
  );
}