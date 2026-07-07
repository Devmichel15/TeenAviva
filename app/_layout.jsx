import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../src/contexts/AuthContext';
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>    </AuthProvider>
  );
}
