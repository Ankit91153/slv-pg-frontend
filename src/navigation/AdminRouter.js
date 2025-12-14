import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabNavigator from './AdminTabNavigator';
import FloorsScreen from '../screens/adminScreens/services/FloorsScreen';
import RoomTypesScreen from '../screens/adminScreens/services/RoomTypesScreen';
import RoomsScreen from '../screens/adminScreens/services/RoomsScreen';
import BedsScreen from '../screens/adminScreens/services/BedsScreen';
import BookingsScreen from '../screens/adminScreens/services/BookingsScreen';
import { SCREEN_NAMES } from '../constants/screens';

const Stack = createNativeStackNavigator();

export default function AdminRouter() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="AdminTabs" 
        component={AdminTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.FLOORS} 
        component={FloorsScreen}
        options={{ title: 'Floors' }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ROOM_TYPES} 
        component={RoomTypesScreen}
        options={{ title: 'Room Types' }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.ROOMS} 
        component={RoomsScreen}
        options={{ title: 'Rooms' }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.BEDS} 
        component={BedsScreen}
        options={{ title: 'Beds' }}
      />
      <Stack.Screen 
        name={SCREEN_NAMES.BOOKINGS} 
        component={BookingsScreen}
        options={{ title: 'Bookings' }}
      />
    </Stack.Navigator>
  );
}
