export const AIRPORTS = [
  { code: 'OAK', name: 'Oakland', country: 'US' },
  { code: 'SFO', name: 'San Francisco', country: 'US' },
  { code: 'SMF', name: 'Sacramento', country: 'US' },
  { code: 'SJC', name: 'San Jose', country: 'US' },
  { code: 'LAX', name: 'Los Angeles', country: 'US' },
  { code: 'MLM', name: 'Morelia', country: 'MX' },
  { code: 'GDL', name: 'Guadalajara', country: 'MX' },
  { code: 'MEX', name: 'Mexico City', country: 'MX' },
  { code: 'CUN', name: 'Cancun', country: 'MX' },
  { code: 'MTY', name: 'Monterrey', country: 'MX' },
  { code: 'LAS', name: 'Las Vegas', country: 'US' },
  { code: 'JFK', name: 'New York (JFK)', country: 'US' },
]

export interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: string
  arrival: string
  duration: string
  stops: number
  price: number
  currency: string
  seatsLeft: number
  available: boolean
}

export function getMockFlights(origin: string, destination: string): Flight[] {
  const isInternational = ['MLM','GDL','MEX','CUN','MTY'].includes(destination) || ['MLM','GDL','MEX','CUN','MTY'].includes(origin)

  return [
    {
      id: '1',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(Math.random() * 900) + 100}`,
      departure: '6:05 AM',
      arrival: isInternational ? '10:35 AM' : '7:40 AM',
      duration: isInternational ? '4h 30m' : '1h 35m',
      stops: 0,
      price: isInternational ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 3,
      available: true,
    },
    {
      id: '2',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(Math.random() * 900) + 100}`,
      departure: '10:20 AM',
      arrival: isInternational ? '2:55 PM' : '11:55 AM',
      duration: isInternational ? '4h 35m' : '1h 35m',
      stops: 0,
      price: isInternational ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 7,
      available: true,
    },
    {
      id: '3',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(Math.random() * 900) + 100}`,
      departure: '2:45 PM',
      arrival: isInternational ? '7:20 PM' : '4:20 PM',
      duration: isInternational ? '4h 35m' : '1h 35m',
      stops: 0,
      price: isInternational ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 0,
      available: false,
    },
    {
      id: '4',
      airline: 'Volaris',
      flightNumber: `Y4 ${Math.floor(Math.random() * 900) + 100}`,
      departure: '7:10 PM',
      arrival: isInternational ? '11:45 PM' : '8:45 PM',
      duration: isInternational ? '4h 35m' : '1h 35m',
      stops: 0,
      price: isInternational ? 596 : 0,
      currency: 'MXN',
      seatsLeft: 2,
      available: true,
    },
  ]
}

// Calendar availability: 0=unavailable, 1=low seats, 2=available, 3=good availability
export function getCalendarData(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()
  const result: { day: number; status: 0 | 1 | 2 | 3 }[] = []

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    if (date < today) {
      result.push({ day: d, status: 0 })
      continue
    }
    // Mock pattern: weekends have better availability
    const dow = date.getDay()
    if (dow === 0 || dow === 6) {
      result.push({ day: d, status: Math.random() > 0.3 ? 3 : 1 })
    } else if (dow === 5) {
      result.push({ day: d, status: Math.random() > 0.4 ? 2 : 1 })
    } else {
      const r = Math.random()
      result.push({ day: d, status: r > 0.7 ? 2 : r > 0.4 ? 1 : 0 })
    }
  }
  return result
}
