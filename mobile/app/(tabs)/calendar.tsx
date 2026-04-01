import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AIRPORTS } from '~/lib/airports';
import { getCalendarData } from '~/lib/mockData';
import AirportPicker from '~/components/AirportPicker';

const STATUS_COLORS = ['bg-gray-700', 'bg-yellow-500', 'bg-green-400', 'bg-green-500'];
const STATUS_LABELS = ['Sin asientos', 'Limitado', 'Disponible', 'Buena disp.'];
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mi\u00e9', 'Jue', 'Vie', 'S\u00e1b'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function CalendarScreen() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [origin, setOrigin] = useState('OAK');
  const [destination, setDestination] = useState('MLM');

  const availability = getCalendarData(origin, destination, year, month);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  function prevMonth() {
    if (month === 1) {
      setMonth(12);
      setYear(currentYear => currentYear - 1);
    } else {
      setMonth(currentMonth => currentMonth - 1);
    }
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear(currentYear => currentYear + 1);
    } else {
      setMonth(currentMonth => currentMonth + 1);
    }
  }

  function handleDayPress(day: number) {
    const status = availability[day] ?? 0;
    if (status === 0) return;

    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    router.push({ pathname: '/(tabs)', params: { origin, destination, date: dateString } });
  }

  const cells: Array<number | null> = [];
  for (let index = 0; index < firstDay; index += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  const totalAvailable = Object.values(availability).filter(value => value > 0).length;
  const goodAvailability = Object.values(availability).filter(value => value >= 2).length;
  const soldOut = Object.values(availability).filter(value => value === 0).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-950">
      <ScrollView className="flex-1">
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-white">{'Calendario \u{1F4C5}'}</Text>
          <Text className="mt-1 text-sm text-gray-400">Disponibilidad mensual</Text>
        </View>

        <View className="mx-4 mt-2 flex-row gap-3 rounded-2xl bg-gray-900 p-4">
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-400">Origen</Text>
            <AirportPicker airports={AIRPORTS} value={origin} onChange={setOrigin} placeholder="Origen" />
          </View>
          <View className="flex-1">
            <Text className="mb-1 text-xs text-gray-400">Destino</Text>
            <AirportPicker airports={AIRPORTS} value={destination} onChange={setDestination} placeholder="Destino" />
          </View>
        </View>

        <View className="mx-4 mt-4 flex-row items-center justify-between">
          <TouchableOpacity onPress={prevMonth} className="p-2">
            <Text className="text-xl text-white">{'\u2039'}</Text>
          </TouchableOpacity>
          <Text className="text-base font-semibold text-white">{MONTHS[month - 1]} {year}</Text>
          <TouchableOpacity onPress={nextMonth} className="p-2">
            <Text className="text-xl text-white">{'\u203A'}</Text>
          </TouchableOpacity>
        </View>

        <View className="mx-4 mt-2">
          <View className="mb-1 flex-row">
            {WEEKDAYS.map(weekday => (
              <View key={weekday} className="flex-1 items-center">
                <Text className="text-xs text-gray-500">{weekday}</Text>
              </View>
            ))}
          </View>
          <View className="flex-row flex-wrap">
            {cells.map((day, index) => (
              <View key={`${day ?? 'blank'}-${index}`} className="w-[14.28%] p-0.5">
                {day === null ? (
                  <View className="aspect-square" />
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDayPress(day)}
                    disabled={(availability[day] ?? 0) === 0}
                    className={`aspect-square items-center justify-center rounded-lg ${STATUS_COLORS[availability[day] ?? 0]}`}
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

        <View className="mx-4 mt-4 flex-row flex-wrap gap-3">
          {STATUS_LABELS.map((label, index) => (
            <View key={label} className="flex-row items-center gap-1">
              <View className={`h-3 w-3 rounded-full ${STATUS_COLORS[index]}`} />
              <Text className="text-xs text-gray-400">{label}</Text>
            </View>
          ))}
        </View>

        <View className="mx-4 mt-4 mb-8 flex-row gap-3">
          {[
            { label: 'Con asientos', value: totalAvailable },
            { label: 'Buena disp.', value: goodAvailability },
            { label: 'Sin asientos', value: soldOut },
          ].map(stat => (
            <View key={stat.label} className="flex-1 items-center rounded-xl bg-gray-900 p-3">
              <Text className="text-xl font-bold text-white">{stat.value}</Text>
              <Text className="mt-1 text-center text-xs text-gray-400">{stat.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
