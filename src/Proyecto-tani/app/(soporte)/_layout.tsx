import { Stack } from 'expo-router';

export default function SoporteLayout() {
  return (
    <Stack>
      <Stack.Screen name="sugerencia" options={{ headerShown: false }} />
      <Stack.Screen name="faq" options={{ headerShown: false }} />
      <Stack.Screen name="detalle-faq" options={{ headerShown: false }} />
    </Stack>
  );
}
