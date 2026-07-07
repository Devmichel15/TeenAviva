<<<<<<< HEAD
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../src/contexts/AuthContext';
=======
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { AuthProvider } from "../src/contexts/AuthContext";
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1

export default function RootLayout() {
  const [loaded] = useFonts({
    ManropeRegular: require('../assets/fonts/Manrope-Regular.ttf'),
    ManropeLight: require('../assets/fonts/Manrope-Light.ttf'),
    ManropeSemiBold: require('../assets/fonts/Manrope-SemiBold.ttf'),
    ManropeBold: require('../assets/fonts/Manrope-Bold.ttf'),
  });

  if (!loaded) return null;

  return (
    <AuthProvider>
<<<<<<< HEAD
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
=======
      <Slot />
>>>>>>> 99b8c04df4fe5bb22abd0185030e2cd0b3a1cdc1
    </AuthProvider>
  );
}
