export interface Airport {
  code: string;
  city: string;
  country: 'US' | 'MX';
}

export const AIRPORTS: Airport[] = [
  { code: 'OAK', city: 'Oakland', country: 'US' },
  { code: 'SFO', city: 'San Francisco', country: 'US' },
  { code: 'SMF', city: 'Sacramento', country: 'US' },
  { code: 'SJC', city: 'San Jose', country: 'US' },
  { code: 'LAX', city: 'Los Angeles', country: 'US' },
  { code: 'LAS', city: 'Las Vegas', country: 'US' },
  { code: 'JFK', city: 'New York (JFK)', country: 'US' },
  { code: 'ORD', city: "Chicago (O'Hare)", country: 'US' },
  { code: 'DFW', city: 'Dallas/Fort Worth', country: 'US' },
  { code: 'IAH', city: 'Houston', country: 'US' },
  { code: 'PHX', city: 'Phoenix', country: 'US' },
  { code: 'SAN', city: 'San Diego', country: 'US' },
  { code: 'ONT', city: 'Ontario (CA)', country: 'US' },
  { code: 'DEN', city: 'Denver', country: 'US' },
  { code: 'MEX', city: 'Mexico City', country: 'MX' },
  { code: 'GDL', city: 'Guadalajara', country: 'MX' },
  { code: 'MTY', city: 'Monterrey', country: 'MX' },
  { code: 'CUN', city: 'Canc\u00fan', country: 'MX' },
  { code: 'TIJ', city: 'Tijuana', country: 'MX' },
  { code: 'MLM', city: 'Morelia', country: 'MX' },
  { code: 'BJX', city: 'Le\u00f3n/Baj\u00edo', country: 'MX' },
  { code: 'MZT', city: 'Mazatl\u00e1n', country: 'MX' },
  { code: 'PVR', city: 'Puerto Vallarta', country: 'MX' },
  { code: 'SJD', city: 'Los Cabos', country: 'MX' },
  { code: 'AGU', city: 'Aguascalientes', country: 'MX' },
  { code: 'CUL', city: 'Culiac\u00e1n', country: 'MX' },
  { code: 'HMO', city: 'Hermosillo', country: 'MX' },
  { code: 'MID', city: 'M\u00e9rida', country: 'MX' },
  { code: 'OAX', city: 'Oaxaca', country: 'MX' },
  { code: 'SLP', city: 'San Luis Potos\u00ed', country: 'MX' },
  { code: 'VER', city: 'Veracruz', country: 'MX' },
  { code: 'ZIH', city: 'Ixtapa/Zihuatanejo', country: 'MX' },
  { code: 'ZCL', city: 'Zacatecas', country: 'MX' },
  { code: 'MXL', city: 'Mexicali', country: 'MX' },
  { code: 'TAM', city: 'Tampico', country: 'MX' },
  { code: 'VSA', city: 'Villahermosa', country: 'MX' },
  { code: 'LMM', city: 'Los Mochis', country: 'MX' },
  { code: 'ZLO', city: 'Manzanillo', country: 'MX' },
  { code: 'TGZ', city: 'Tuxtla Guti\u00e9rrez', country: 'MX' },
];

export const US_AIRPORTS = AIRPORTS.filter(a => a.country === 'US');
export const MX_AIRPORTS = AIRPORTS.filter(a => a.country === 'MX');
