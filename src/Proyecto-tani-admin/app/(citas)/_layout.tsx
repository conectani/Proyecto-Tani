import { Stack } from 'expo-router';

export default function CitasLayout() {
  return (
    <Stack>
      <Stack.Screen name="agendar" options={{ headerShown: false }} />
      <Stack.Screen name="detalle" options={{ headerShown: false }} />
      <Stack.Screen name="confirmacion" options={{ headerShown: false }} />
    </Stack>
  );
}
