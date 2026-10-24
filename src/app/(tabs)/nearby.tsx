import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PIN_COLORS, PlacesMap } from '@/components/places-map';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Screen } from '@/components/ui';
import { Colors, Spacing } from '@/constants/theme';
import { DALLAS_PLACES, type Place, type PlaceType } from '@/data/dallas-places';
import { useLanguage } from '@/lib/i18n';
import { callNumber, openDirections, openWebsite } from '@/lib/links';

const FILTERS: (PlaceType | 'all')[] = ['all', 'wic', 'clinic', 'food', 'benefits'];

export default function NearbyScreen() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<PlaceType | 'all'>('all');
  const [selected, setSelected] = useState<Place | null>(null);

  const places = filter === 'all' ? DALLAS_PLACES : DALLAS_PLACES.filter((place) => place.type === filter);

  const choose = (place: Place) => setSelected(place.name === selected?.name ? null : place);

  return (
    <Screen>
      <View style={styles.intro}>
        <ThemedText type="subtitle">{t.nearby.title}</ThemedText>
        <ThemedText themeColor="textSecondary">{t.nearby.intro}</ThemedText>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((type) => (
          <Chip
            key={type}
            label={t.nearby.filters[type]}
            selected={filter === type}
            onPress={() => {
              setFilter(type);
              setSelected(null);
            }}
          />
        ))}
      </View>

      <View style={styles.mapFrame}>
        <PlacesMap places={places} selected={selected} onSelect={setSelected} />
      </View>

      <View>
        {places.map((place) => {
          const open = place.name === selected?.name;
          return (
            <View key={place.name} style={[styles.place, open && styles.placeOpen]}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => choose(place)}>
                <View style={styles.placeTop}>
                  <View style={[styles.dot, { backgroundColor: PIN_COLORS[place.type] }]} />
                  <ThemedText type="label" themeColor="textSecondary">
                    {t.nearby.types[place.type]}
                  </ThemedText>
                </View>
                <ThemedText type="bold">{place.name}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {place.address}, {place.city}
                </ThemedText>
              </Pressable>

              {open && (
                <View style={styles.details}>
                  <View>
                    <ThemedText type="small">{place.phone}</ThemedText>
                    {place.hours && <ThemedText type="small">{place.hours}</ThemedText>}
                  </View>
                  <View style={styles.actions}>
                    <View style={styles.action}>
                      <Button label={t.nearby.call} onPress={() => callNumber(place.phone)} />
                    </View>
                    <View style={styles.action}>
                      <Button
                        label={t.nearby.directions}
                        variant="secondary"
                        onPress={() => openDirections(`${place.address}, ${place.city}`)}
                      />
                    </View>
                  </View>
                  <Button label={t.nearby.website} variant="link" onPress={() => openWebsite(place.source)} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        {t.nearby.checked}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: Spacing.two },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  mapFrame: { overflow: 'hidden', borderRadius: 6 },
  place: { borderTopWidth: 1, borderColor: Colors.light.border, paddingVertical: 14, gap: Spacing.two },
  placeOpen: { backgroundColor: Colors.light.soft, marginHorizontal: -12, paddingHorizontal: 12 },
  placeTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two, marginBottom: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  details: { gap: Spacing.three },
  actions: { flexDirection: 'row', gap: Spacing.two },
  action: { flex: 1 },
});
