import { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList, TextInput, Pressable,
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
    a.code.toLowerCase().includes(query.toLowerCase()));

  function select(code: string) {
    onChange(code);
    setOpen(false);
    setQuery('');
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-xl bg-gray-800 px-3 py-3"
      >
        <View>
          <Text className="font-semibold text-white">{selected?.code ?? '---'}</Text>
          <Text className="text-xs text-gray-400" numberOfLines={1}>
            {selected?.city ?? placeholder}
          </Text>
        </View>
        <Text className="text-gray-500">{'\u25BE'}</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-950 pt-4">
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text className="text-lg font-bold text-white">Seleccionar aeropuerto</Text>
            <TouchableOpacity onPress={() => { setOpen(false); setQuery(''); }}>
              <Text className="font-semibold text-green-400">Cerrar</Text>
            </TouchableOpacity>
          </View>
          <View className="mb-3 px-4">
            <TextInput
              className="rounded-xl bg-gray-800 px-4 py-3 text-white"
              placeholder={'Buscar ciudad o c\u00f3digo...'}
              placeholderTextColor="#6b7280"
              value={query}
              onChangeText={setQuery}
              autoFocus
            />
          </View>
          <FlatList
            data={filtered}
            keyExtractor={airport => airport.code}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => select(item.code)}
                className={`flex-row items-center border-b border-gray-800 px-5 py-4 ${item.code === value ? 'bg-green-900/30' : ''}`}
              >
                <Text className="w-12 font-bold text-white">{item.code}</Text>
                <Text className="flex-1 text-gray-300">{item.city}</Text>
                {item.code === value && <Text className="text-green-400">{'\u2713'}</Text>}
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
