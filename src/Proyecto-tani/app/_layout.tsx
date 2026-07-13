import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useColorScheme } from '@/hooks/use-color-scheme';
import NetInfo from '@react-native-community/netinfo';
import { syncOfflineQueue } from '@/utils/syncManager';


SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(auth)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    // Escucha cambios de conexión
    const desuscribir = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('¡Señal recuperada! Sincronizando datos...');
        syncOfflineQueue();
      }
    });
    return () => desuscribir();
  }, []);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();

      // Mostrar la pantalla de carga de forma dinámica (máximo 1.5 segundos)
      const timer = setTimeout(() => {
        setVideoFinished(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  if (!videoFinished) {
    return (
      <View style={styles.splashContainer}>
        <Video
          source={require('@/assets/videos/splash.mp4')}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={true}
          rate={1.5}
          isMuted={true}
        />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(citas)" options={{ headerShown: false }} />
          <Stack.Screen name="(notas)" options={{ headerShown: false }} />
          <Stack.Screen name="(soporte)" options={{ headerShown: false }} />
          <Stack.Screen name="(aprende)" options={{ headerShown: false }} />
          <Stack.Screen name="mi-carnet" options={{ headerShown: false }} />
          <Stack.Screen name="notificaciones" options={{ headerShown: false }} />
          <Stack.Screen name="perfil" options={{ headerShown: false }} />
          <Stack.Screen name="politica" options={{ headerShown: false }} />
          <Stack.Screen name="terminos" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#006953',
  },
});
