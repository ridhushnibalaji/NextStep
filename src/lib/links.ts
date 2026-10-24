import { openBrowserAsync } from 'expo-web-browser';
import { Linking, Platform } from 'react-native';

export const YOUR_TEXAS_BENEFITS = 'https://www.yourtexasbenefits.com';

export function openWebsite(url: string) {
  openBrowserAsync(url);
}

export function callNumber(number: string) {
  Linking.openURL(`tel:${number.replace(/[^0-9]/g, '')}`);
}

export function openDirections(address: string) {
  const a = encodeURIComponent(address);
  const url =
    Platform.OS === 'ios' ? `https://maps.apple.com/?daddr=${a}` : `https://www.google.com/maps/dir/?api=1&destination=${a}`;
  Linking.openURL(url);
}
