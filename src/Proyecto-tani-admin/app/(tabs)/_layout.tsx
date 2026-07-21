import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function renderHomeIcon({ color }: Readonly<{ color: string }>) {
  return <Ionicons name="grid-outline" size={22} color={color} />;
}

function renderMothersIcon({ color }: Readonly<{ color: string }>) {
  return <Ionicons name="people-outline" size={22} color={color} />;
}

function renderPaymentsIcon({ color }: Readonly<{ color: string }>) {
  return <Ionicons name="card-outline" size={22} color={color} />;
}

function renderAnnouncementsIcon({ color }: Readonly<{ color: string }>) {
  return <Ionicons name="megaphone-outline" size={22} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#006953', // Tani primary verde
        tabBarInactiveTintColor: '#6e7a74',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          backgroundColor: '#FFF',
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tabs.Screen
        name="madres"
        options={{
          title: 'Madres',
          tabBarIcon: renderMothersIcon,
        }}
      />
      <Tabs.Screen
        name="pagos"
        options={{
          title: 'Pagos',
          tabBarIcon: renderPaymentsIcon,
        }}
      />
      <Tabs.Screen
        name="anuncios"
        options={{
          title: 'Anuncios',
          tabBarIcon: renderAnnouncementsIcon,
        }}
      />
    </Tabs>
  );
}