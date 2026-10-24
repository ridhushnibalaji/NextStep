import { PublicSans_400Regular } from '@expo-google-fonts/public-sans/400Regular';
import { PublicSans_600SemiBold } from '@expo-google-fonts/public-sans/600SemiBold';
import { PublicSans_700Bold } from '@expo-google-fonts/public-sans/700Bold';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { BrandFonts, Colors } from '@/constants/theme';
import { HouseholdProvider } from '@/lib/household';
import { LanguageProvider, useLanguage } from '@/lib/i18n';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.background,
    text: Colors.light.text,
    primary: Colors.light.tintText,
    border: Colors.light.border,
  },
};

function RootStack() {
  const { t } = useLanguage();
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerShadowVisible: false,
        headerTintColor: Colors.light.text,
        headerTitleStyle: { fontFamily: BrandFonts.bold },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="screener" options={{ title: t.screener.title }} />
      <Stack.Screen name="results" options={{ title: t.results.title }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PublicSans_400Regular,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
  });
  const ready = fontsLoaded || fontError;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ThemeProvider value={theme}>
      <LanguageProvider>
        <HouseholdProvider>
          <RootStack />
        </HouseholdProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
