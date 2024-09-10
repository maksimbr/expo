import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black', // Black background for tab bar
          borderTopColor: 'transparent', // Remove top border
          elevation: 4,
          shadowColor: 'black', 
          shadowOffset: { width: 0, height: -2 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 4, 
        },
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)', // Slightly transparent white for inactive icons
        tabBarShowLabel: false, // Hide tab labels
        tabBarIconStyle: { 
          marginTop: 6,
          marginBottom: 6
        },
        // Customize the active tab indicator (optional)
      }}>
      <Tabs.Screen
        name="recipe"
        options={{
          title: 'Recipe',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'list' : 'list'} color={color} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'apps-outline' : 'apps-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'camera' : 'camera-outline'} color={color} />
          ),
        }}
        />
      <Tabs.Screen
        name="user"
        options={{
          title: 'User',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
}
