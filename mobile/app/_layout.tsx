import '../global.css';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Session } from '@supabase/supabase-js';
import { AuthProvider } from '~/lib/auth-context';
import { isSupabaseConfigured, supabase, supabaseConfigError } from '~/lib/supabase';

SplashScreen.preventAutoHideAsync().catch(() => {});

function ConfigErrorScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <View className="flex-1 justify-center px-6">
        <View className="rounded-3xl border border-yellow-800/50 bg-yellow-950/30 p-6">
          <Text className="mb-2 text-2xl font-bold text-white">Configuraci\u00f3n pendiente</Text>
          <Text className="mb-4 text-sm text-yellow-100">{supabaseConfigError}</Text>
          <Text className="text-sm text-gray-300">
            Agrega esas variables a `volarfacil-mobile/.env` y vuelve a abrir Expo.
          </Text>
        </View>
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  if (!isSupabaseConfigured || !supabase) return <ConfigErrorScreen />;

  return (
    <AuthProvider value={{ ready, session }}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
