import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { US_AIRPORTS, MX_AIRPORTS, AIRPORTS } from '~/lib/airports';
import { getCalendarData } from '~/lib/mockData';
import AirportPicker from '~/components/AirportPicker';

const STATUS_COLORS = ['bg-gray-700', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
const STATUS_LABELS = ['Sin asientos', 'Limitado', 'Disponible', 'Buena disp.'];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

export default function CalendarScreen() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [origin, setOrigin] = useState('OAK');
  const [destination, setDestination] = useState('MEX');

  const availability = getCalendarData(origin, destination, year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleDayPress(day: number) {
    const status = availability[day] ?? 0;
    if (status === 0) return;
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    router.push({ pathname: '/(tabs)', params: { origin, destination, date: dateStr } });
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const totalAvail = Object.values(availability).filter(v => v > 0).length;
  const goodAvail = Object.values(availability).filter(v => v >= 2).length;
  const soldOut = Object.values(availability).filter(v => v === 0).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">Calendario 📅</Text>
          <Text className="text-gray-400 text-sm mt-1">Disponibilidad mensual</Text>
        </View>

        {/* Pickers */}
        <View className="mx-4 mt-2 bg-gray-900 rounded-2xl p-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="text-gray-400 text-xs mb-1">Origen</Text>
            <AirportPicker airports={US_AIRPORTS} value={origin} onChange={setOrigin} placeholder="Origen" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 text-xs mb-1">Destino</Text>
            <AirportPicker airports={MX_AIRPORTS} value={destination} onChange={setDestination} placeholder="Destino" />
          </View>
        </View>

        {/* Month nav */}
        <View className="flex-row items-center justify-between mx-4 mt-4">
          <TouchableOpacity onPress={prevMonth} className="p-2">
            <Text className="text-white text-xl">‹</Text>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-base">{MONTHS[month - 1]} {year}</Text>
          <TouchableOpacity onPress={nextMonth} className="p-2">
            <Text className="text-white text-xl">›</Text>
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View className="mx-4 mt-2">
          <View className="flex-row mb-1">
            {WEEKDAYS.map(w => (
              <View key={w} className="flex-1 items-center">
                <Text className="text-gray-500 text-xs">{w}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {cells.map((day, i) => (
              <View key={i} className="w-[14.28%] p-0.5">
                {day === null ? (
                  <View className="aspect-square" />
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDayPress(day)}
                    disabled={(availability[day] ?? 0) === 0}
                    className={`aspect-square rounded-lg items-center justify-center ${STATUS_COLORS[availability[day] ?? 0]}`}
                  >
                    <Text className={`text-xs font-medium ${(availability[day] ?? 0) === 0 ? 'text-gray-500' : 'text-gray-900'}`}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View className="flex-row flex-wrap gap-3 mx-4 mt-4">
          {STATUS_LABELS.map((label, i) => (
            <View key={i} className="flex-row items-center gap-1">
              <View className={`w-3 h-3 rounded-full ${STATUS_COLORS[i]}`} />
              <Text className="text-gray-400 text-xs">{label}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View className="flex-row mx-4 mt-4 mb-8 gap-3">
          {[
            { label: 'Con asientos', value: totalAvail },
            { label: 'Buena disp.', value: goodAvail },
            { label: 'Sin asientos', value: soldOut },
          ].map(stat => (
            <View key={stat.label} className="flex-1 bg-gray-900 rounded-xl p-3 items-center">
              <Text className="text-white text-xl font-bold">{stat.value}</Text>
              <Text className="text-gray-400 text-xs mt-1 text-center">{stat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
