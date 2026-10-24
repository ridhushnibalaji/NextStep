import type { Place } from '@/data/dallas-places';

export const PIN_COLORS = { wic: '#0F5E59', clinic: '#2B5C9E', food: '#B4521E', benefits: '#6B4C9A' } as const;

export function PlacesMap(_props: { places: Place[]; selected: Place | null; onSelect: (place: Place) => void }) {
  return null;
}
