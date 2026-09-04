import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Pill, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function TerminalDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { terminals, routes, saveRoute } = useTransit();
  const terminal = terminals.find((item) => item.id === id);
  const terminalRoutes = routes.filter((route) => route.terminalId === id);
  if (!terminal) return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={[styles.missing, { color: colors.foreground }]}>Terminal not found.</Text></View>;
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
    <View style={styles.topBar}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><Text style={[styles.topLabel, { color: colors.mutedForeground }]}>TERMINAL</Text><View style={{ width: 40 }} /></View>
    <View style={[styles.hero, { backgroundColor: colors.secondary }]}><View style={[styles.heroIcon, { backgroundColor: colors.card }]}><Feather name="map-pin" size={25} color={colors.primary} /></View><Text style={[styles.title, { color: colors.foreground }]}>{terminal.name}</Text><Text style={[styles.location, { color: colors.secondaryForeground }]}>{terminal.city}, {terminal.province}</Text><Text style={[styles.description, { color: colors.secondaryForeground }]}>{terminal.description}</Text><View style={styles.coordinates}><Feather name="crosshair" size={14} color={colors.secondaryForeground} /><Text style={[styles.coordinatesText, { color: colors.secondaryForeground }]}>{terminal.latitude.toFixed(4)}, {terminal.longitude.toFixed(4)}</Text></View></View>
    <SectionHeading title={`Available routes · ${terminalRoutes.length}`} /><View style={[styles.mapPlaceholder, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.mapGrid, { borderColor: colors.border }]} /><View style={[styles.mapPin, { backgroundColor: colors.primary }]}><Feather name="map-pin" size={18} color={colors.primaryForeground} /></View><Text style={[styles.mapLabel, { color: colors.mutedForeground }]}>Location preview</Text></View>
    {terminalRoutes.map((route) => <View key={route.id} style={[styles.routeCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.routeBody}><Pill tone="mint">{route.transfers ? '1 transfer' : 'Direct'}</Pill><Text style={[styles.routeName, { color: colors.foreground }]}>{route.routeName}</Text><Text style={[styles.routeMeta, { color: colors.mutedForeground }]}>To {route.destination}  ·  ₱{route.fare}  ·  {route.estimatedTravelTime}</Text></View><Pressable accessibilityLabel="View route" testID="View route" onPress={() => router.push({ pathname: '/route/[id]', params: { id: route.id, from: terminal.city, to: route.destination } })}><Feather name="arrow-up-right" size={19} color={colors.primary} /></Pressable></View>)}
    <Pressable onPress={() => Alert.alert('Terminal saved', 'Terminal shortcuts will appear in a future saved places update.')} style={({ pressed }) => [styles.saveTerminal, { borderColor: colors.border }, pressed && styles.pressed]}><Feather name="bookmark" size={16} color={colors.foreground} /><Text style={[styles.saveTerminalText, { color: colors.foreground }]}>Save terminal</Text></Pressable>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  topBar: { paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  topLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  hero: { marginHorizontal: 18, borderRadius: 24, padding: 18, marginBottom: 26 },
  heroIcon: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 25, lineHeight: 30, letterSpacing: -0.6 },
  location: { fontFamily: 'Inter_600SemiBold', fontSize: 13, marginTop: 6 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 18, marginTop: 14 },
  coordinates: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 17 },
  coordinatesText: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  mapPlaceholder: { marginHorizontal: 18, height: 134, borderRadius: 20, borderWidth: 1, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  mapGrid: { ...StyleSheet.absoluteFill, borderWidth: 1, borderStyle: 'dashed', opacity: 0.35, transform: [{ rotate: '12deg' }, { scale: 1.2 }] },
  mapPin: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  mapLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 9 },
  routeCard: { marginHorizontal: 18, borderRadius: 17, borderWidth: 1, padding: 13, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  routeBody: { flex: 1 },
  routeName: { fontFamily: 'Inter_700Bold', fontSize: 14, marginTop: 9 },
  routeMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  saveTerminal: { marginHorizontal: 18, minHeight: 46, borderWidth: 1, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8 },
  saveTerminalText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  pressed: { opacity: 0.72 },
});