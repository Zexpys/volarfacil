import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '@supabase/supabase-js';
import { supabase } from '~/lib/supabase';

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  function handleSignOut() {
    const client = supabase;

    if (!client) {
      Alert.alert('Configuraci\u00f3n pendiente', 'Agrega tus variables de Supabase para usar la cuenta.');
      return;
    }

    Alert.alert('Cerrar sesi\u00f3n', '\u00bfEst\u00e1s seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: () => {
          void client.auth.signOut();
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">{'Cuenta \u{1F464}'}</Text>
        </View>

        <View className="mx-4 mt-4 rounded-2xl bg-gray-900 p-5">
          <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <Text className="text-2xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          <Text className="text-base font-semibold text-white">{user?.email}</Text>
          <View className="mt-2 self-start rounded-full bg-gray-800 px-3 py-1">
            <Text className="text-xs text-gray-300">{'Plan gratis \u00b7 5 b\u00fasquedas/d\u00eda'}</Text>
          </View>
        </View>

        <View className="mx-4 mt-4 rounded-2xl border border-green-700 bg-green-900 p-5">
          <Text className="mb-1 text-base font-bold text-white">{'\u2728 Actualiza a Pro'}</Text>
          <Text className="mb-3 text-sm text-green-200">
            {'B\u00fasquedas ilimitadas + alertas de precios + calendario completo'}
          </Text>
          <TouchableOpacity className="rounded-xl bg-green-500 py-3">
            <Text className="text-center font-semibold text-white">Ver planes</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 mt-4 overflow-hidden rounded-2xl bg-gray-900">
          {[
            { label: '\u{1F514} Notificaciones', sub: 'Gestionar alertas de vuelos' },
            { label: '\u{1F512} Cambiar contrase\u00f1a', sub: '' },
            { label: '\u{1F4CB} T\u00e9rminos y privacidad', sub: '' },
          ].map((item, index, array) => (
            <TouchableOpacity
              key={item.label}
              className={`flex-row items-center justify-between px-5 py-4 ${index < array.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <View>
                <Text className="text-white">{item.label}</Text>
                {item.sub ? <Text className="mt-0.5 text-xs text-gray-400">{item.sub}</Text> : null}
              </View>
              <Text className="text-gray-500">{'\u203A'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mx-4 mt-4 mb-8">
          <TouchableOpacity
            onPress={handleSignOut}
            className="rounded-2xl border border-red-700 bg-red-900/50 py-4"
          >
            <Text className="text-center font-semibold text-red-400">{'Cerrar sesi\u00f3n'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
