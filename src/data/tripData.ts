import { ChecklistItem } from '../types';

export const INITIAL_ITEMS: ChecklistItem[] = [
  // Wear on the flight (7 items worn)
  {
    id: 'f-0a',
    name: '1 pair underwear',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-0b',
    name: '1 pair warm socks',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-1',
    name: 'ABC trousers',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-2',
    name: 'T-shirt (white)',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-4',
    name: 'Overshirt',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-5',
    name: 'Down jacket',
    category: 'flight',
    isPacked: false,
  },
  {
    id: 'f-6',
    name: 'Vivobarefoot shoes',
    category: 'flight',
    isPacked: false,
  },

  // Documents & misc (part 02 - 6 items)
  {
    id: 'd-1',
    name: 'Passport',
    category: 'documents',
    isPacked: false,
  },
  {
    id: 'd-2',
    name: 'Wallet/cards',
    category: 'documents',
    isPacked: false,
  },
  {
    id: 'd-3',
    name: 'Sunglasses',
    category: 'documents',
    isPacked: false,
  },
  {
    id: 'd-4',
    name: 'Small travel towel (NanoDry)',
    category: 'documents',
    isPacked: false,
  },
  {
    id: 'd-5',
    name: 'Laundry bag',
    category: 'documents',
    isPacked: false,
  },
  {
    id: 'd-6',
    name: 'Foldable tote/day bag',
    category: 'documents',
    isPacked: false,
  },

  // Clothing (in packing cube - 11 items)
  {
    id: 'c-1',
    name: '2 T-shirts (black, pale yellow)',
    details: '1 white worn on flight = 3 total',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-2',
    name: '1 button-up shirt',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-3',
    name: '1 gym vest',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-4',
    name: '1 technical/gym T-shirt',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-5',
    name: '1 shorts (ABC)',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-6',
    name: '1 gym/swim shorts',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-7',
    name: '1 thermal top',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-10',
    name: '4 underwear',
    details: '1 worn on flight = 5 total',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-11',
    name: '4 socks (3 normal, 1 warm)',
    details: '1 warm worn on flight = 5 total',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-13',
    name: '1 rain/wind shell (yellow Montbell)',
    category: 'clothing',
    isPacked: false,
  },
  {
    id: 'c-14',
    name: '1 pair Luna sandals',
    category: 'clothing',
    isPacked: false,
  },

  // Electronics (7 items)
  {
    id: 'e-1',
    name: 'MacBook Air 13"',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-2',
    name: 'Ricoh GR III',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-3',
    name: 'Kindle',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-4',
    name: 'Phone + earbuds',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-5',
    name: 'USB-C charger',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-6',
    name: '2 USB-C cables',
    category: 'electronics',
    isPacked: false,
  },
  {
    id: 'e-7',
    name: 'Universal adapter',
    category: 'electronics',
    isPacked: false,
  },

  // Toiletries (6 items)
  {
    id: 't-1',
    name: 'Toothbrush + toothpaste',
    category: 'toiletries',
    isPacked: false,
  },
  {
    id: 't-2',
    name: 'Deodorant',
    category: 'toiletries',
    isPacked: false,
  },
  {
    id: 't-3',
    name: 'Razor',
    category: 'toiletries',
    isPacked: false,
  },
  {
    id: 't-4',
    name: 'Tiny skincare containers',
    category: 'toiletries',
    isPacked: false,
  },
  {
    id: 't-5',
    name: 'Medication/supplements',
    category: 'toiletries',
    isPacked: false,
  },
  {
    id: 't-6',
    name: 'Small sunscreen',
    category: 'toiletries',
    isPacked: false,
  },
];

export const CATEGORIES_ORDER = [
  { id: 'flight', title: 'Wear on the flight', index: '01' },
  { id: 'documents', title: 'Documents & misc', index: '02' },
  { id: 'clothing', title: 'Clothing (in packing cube)', index: '03' },
  { id: 'electronics', title: 'Electronics', index: '04' },
  { id: 'toiletries', title: 'Toiletries', index: '05' },
] as const;

export const NOTES = [
  {
    id: 'note-layering',
    title: 'Cold weather layer-up (cold mornings)',
    content: 'T-shirt → thermal → overshirt → down → shell',
  },
  {
    id: 'note-maintenance',
    title: 'Maintenance',
    content: 'Do laundry every 4–5 days (~2× per week)',
  },
];
