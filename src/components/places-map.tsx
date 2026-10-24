import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { DALLAS_CENTER, type Place } from '@/data/dallas-places';

export const PIN_COLORS = { wic: '#0F5E59', clinic: '#2B5C9E', food: '#B4521E', benefits: '#6B4C9A' } as const;

export function PlacesMap({
  places,
  selected,
  onSelect,
}: {
  places: Place[];
  selected: Place | null;
  onSelect: (place: Place) => void;
}) {
  const map = useRef<MapView>(null);

  useEffect(() => {
    if (selected) {
      map.current?.animateToRegion(
        { latitude: selected.latitude, longitude: selected.longitude, latitudeDelta: 0.06, longitudeDelta: 0.06 },
        400,
      );
    }
  }, [selected]);

  return (
    <MapView ref={map} style={styles.map} initialRegion={DALLAS_CENTER}>
      {places.map((place) => (
        <Marker
          key={place.name}
          coordinate={{ latitude: place.latitude, longitude: place.longitude }}
          pinColor={PIN_COLORS[place.type]}
          title={place.name}
          description={place.address}
          onPress={() => onSelect(place)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: 320 },
});
