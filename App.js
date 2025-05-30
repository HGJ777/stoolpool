import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/Homepage';
import Quiz from './Screens/Quiz'
import Result from './Screens/Result'
import History from "./Screens/History";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
          />
            <Stack.Screen name="Quiz" component={Quiz} options={{ headerShown: false }} />
            <Stack.Screen name="Result" component={Result} options={{ headerShown: false }} />
            <Stack.Screen name="History" component={History} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
  );
}
