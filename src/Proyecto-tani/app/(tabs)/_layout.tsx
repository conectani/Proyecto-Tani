import { Tabs } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function renderHomeIcon({ color }: { color: string }) {
  return <Ionicons name="home" size={24} color={color} />;
}

function renderCitasIcon({ color }: { color: string }) {
  return <Ionicons name="calendar" size={24} color={color} />;
}

function renderAprendeIcon({ color }: { color: string }) {
  return <Ionicons name="book" size={24} color={color} />;
}

function renderSoporteIcon({ color }: { color: string }) {
  return <Ionicons name="chatbubbles" size={24} color={color} />;
}

export default function TabLayout() {
  // Usa los insets del sistema para que el tab bar respete
  // tanto la barra de estado arriba como los botones de navegación de Android abajo
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.05)',
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -2 },
          // Altura base + espacio extra para la barra de navegación del teléfono
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
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
        name="citas"
        options={{
          title: 'Citas',
          tabBarIcon: renderCitasIcon,
        }}
      />
      <Tabs.Screen
        name="aprende"
        options={{
          title: 'Aprende',
          tabBarIcon: renderAprendeIcon,
        }}
      />
      <Tabs.Screen
        name="soporte"
        options={{
          title: 'Soporte',
          tabBarIcon: renderSoporteIcon,
        }}
      />
    </Tabs>
  );
}