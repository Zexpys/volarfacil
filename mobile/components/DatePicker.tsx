import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

interface Props {
  value: string;
  onChange: (date: string) => void;
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];

export default function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const dates = Array.from({ length: 90 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);

    return {
      iso: date.toISOString().split('T')[0],
      label: `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
      dow: WEEKDAYS[date.getDay()],
    };
  });

  const selected = dates.find(d => d.iso === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-xl bg-gray-800 px-3 py-3"
      >
        <View>
          <Text className="font-semibold text-white">{selected?.label ?? value}</Text>
          <Text className="text-xs text-gray-400">{selected?.dow ?? ''}</Text>
        </View>
        <Text className="text-gray-500">{'\u25BE'}</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-950 pt-4">
          <View className="mb-4 flex-row items-center justify-between px-4">
            <Text className="text-lg font-bold text-white">Seleccionar fecha</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text className="font-semibold text-green-400">Cerrar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={dates}
            keyExtractor={item => item.iso}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onChange(item.iso); setOpen(false); }}
                className={`flex-row items-center border-b border-gray-800 px-5 py-4 ${item.iso === value ? 'bg-green-900/30' : ''}`}
              >
                <Text className="w-10 text-sm text-gray-400">{item.dow}</Text>
                <Text className="flex-1 text-white">{item.label}</Text>
                {item.iso === value && <Text className="text-green-400">{'\u2713'}</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
