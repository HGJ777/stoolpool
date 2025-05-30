import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProfileScreen from './Screens/Profile';
import InfoScreen from './Screens/Info'; // adjust path if needed


const Stack = createNativeStackNavigator();

export default function ProfileStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfileMain" component={ProfileScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
        </Stack.Navigator>

    );
}
