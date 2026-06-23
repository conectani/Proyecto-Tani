import { Stack } from 'expo-router';

export default function NotasLayout() {
  return (
    <Stack>
      <Stack.Screen name="anadir" options={{ headerShown: false }} />
      <Stack.Screen name="detalle" options={{ headerShown: false }} />
      <Stack.Screen name="editar" options={{ headerShown: false }} />
    </Stack>
  );
}
