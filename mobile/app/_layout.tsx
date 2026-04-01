import '../global.css';
import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { Session } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';

SplashScreen.preventAutoHideAsync();

function AuthGate({ session }: { session: Session | null }) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth) {
      router.replace('/(tabs)');
    }
  }, [session, segments]);

  return null;
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      SplashScreen.hideAsync();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  return (
    <>
      <AuthGate session={session} />
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="light" />
    </>
  );
}
