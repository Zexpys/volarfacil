import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const MONTHS = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export default function DatePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  // Generate next 90 days
  const dates = Array.from({ length: 90 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      iso: d.toISOString().split('T')[0],
      label: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      dow: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()],
    };
  });

  const selected = dates.find(d => d.iso === value);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="bg-gray-800 rounded-xl px-3 py-3 flex-row justify-between items-center"
      >
        <View>
          <Text className="text-white font-semibold">{selected?.label ?? value}</Text>
          <Text className="text-gray-400 text-xs">{selected?.dow ?? ''}</Text>
        </View>
        <Text className="text-gray-500">▾</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <View className="flex-1 bg-gray-950 pt-4">
          <View className="flex-row items-center justify-between px-4 mb-4">
            <Text className="text-white font-bold text-lg">Seleccionar fecha</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text className="text-green-400 font-semibold">Cerrar</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={dates}
            keyExtractor={d => d.iso}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onChange(item.iso); setOpen(false); }}
                className={`flex-row items-center px-5 py-4 border-b border-gray-800 ${item.iso === value ? 'bg-green-900/30' : ''}`}
              >
                <Text className="text-gray-400 w-10 text-sm">{item.dow}</Text>
                <Text className="text-white flex-1">{item.label}</Text>
                {item.iso === value && <Text className="text-green-400">✓</Text>}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );
}
