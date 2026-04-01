import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, TextInput, Pressable
} from 'react-native';
import { Airport } from '~/lib/airports';

interface Props {
  airports: Airport[];
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}

export default function AirportPicker({ airports, value, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = airports.find(a => a.code === value);
  const filtered = airports.filter(a =>
    a.city.toLowerCase().includes(query.toLowerCase()) ||
    a.code.toLowerCase().includes(query.toLowerCase())
  );

  function select(code: string) {
    onChange(code);
    setOpen(false);
    setQuery('');
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="bg-gray-800 rounded-xl px-3 py-3 flex-row justify-between items-center"
      >
        <View>
          <Text className="text-white font-semibold">{selected?.code ?? '---'}</Text>
          <Text className="text-gray-400 text-xs" numberOfLines={1}>{selected?.city ?? placeholder}</Text>
        </View>
        <Text className="text-gray-500">▾</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-950 pt-4">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-white font-bold text-lg">Seleccionar aeropuerto</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setQuery(''); }}>
              <Text className="text-green-400 font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View className="px-4 mb-3">
            <TextInput
              className="bg-gray-800 text-white rounded-xl px-4 py-3"
              placeholder="Buscar ciudad o código..."
              placeholderTextColor="#6b7280"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={a => a.code}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => select(item.code)}
                className={`flex-row items-center px-5 py-4 border-b border-gray-800 ${item.code === value ? 'bg-green-900/30' : ''}`}
              >
                <Text className="text-white font-bold w-12">{item.code}</Text>
                <Text className="text-gray-300 flex-1">{item.city}</Text>
                {item.code === value && <Text className="text-green-400">✓</Text>}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
