import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, Pill, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { weatherLocations } from '@/lib/data';

export default function WeatherScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(weatherLocations[0]);
  const suggestions = useMemo(() => weatherLocations.filter((item) => item.location.toLowerCase().includes(query.toLowerCase())), [query]);
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Text style={[styles.eyebrow, { color: colors.primary }]}>LOCAL CONDITIONS</Text><Text style={[styles.title, { color: colors.foreground }]}>Weather for the ride</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>A simple local forecast to help you plan the walk between stops.</Text></View>
    <View style={{ paddingHorizontal: 18 }}><Field label="Choose a location" icon="search" value={query} onChangeText={setQuery} placeholder="Search CALABARZON locations" /></View>
    {query ? <View style={[styles.suggestions, { backgroundColor: colors.card, borderColor: colors.border }]}>{suggestions.map((item) => <Pressable key={item.location} onPress={() => { setSelected(item); setQuery(''); }} style={styles.suggestion}><Feather name="map-pin" size={15} color={colors.primary} /><Text style={[styles.suggestionText, { color: colors.foreground }]}>{item.location}</Text></Pressable>)}</View> : null}
    <View style={[styles.weatherHero, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.heroTop}><View><Pill tone="orange">LIVE-STYLE DEMO</Pill><Text style={[styles.location, { color: colors.foreground }]}>{selected.location}</Text><Text style={[styles.condition, { color: colors.mutedForeground }]}>{selected.condition}</Text></View><View style={[styles.sun, { backgroundColor: `${colors.primary}22` }]}><Ionicons name="partly-sunny" size={38} color={colors.primary} /></View></View><View style={styles.tempRow}><Text style={[styles.temp, { color: colors.foreground }]}>{selected.temperature}°</Text><View style={styles.rainBlock}><Text style={[styles.rainValue, { color: colors.accentForeground }]}>{selected.rainProbability}%</Text><Text style={[styles.rainLabel, { color: colors.mutedForeground }]}>rain probability</Text></View></View><View style={[styles.rainBar, { backgroundColor: colors.muted }]}><View style={[styles.rainFill, { backgroundColor: colors.accent, width: `${selected.rainProbability}%` }]} /></View><View style={styles.status}><Feather name="umbrella" size={16} color={colors.secondaryForeground} /><Text style={[styles.statusText, { color: colors.secondaryForeground }]}>{selected.rainfallStatus}</Text></View></View>
    <SectionHeading title="Travel note" /><View style={[styles.note, { backgroundColor: colors.secondary }]}><View style={[styles.noteIcon, { backgroundColor: colors.card }]}><Feather name="info" size={17} color={colors.secondaryForeground} /></View><Text style={[styles.noteText, { color: colors.secondaryForeground }]}>{selected.note}</Text></View>
    <SectionHeading title="Other CALABARZON locations" /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.locationList}>{weatherLocations.filter((item) => item.location !== selected.location).map((item) => <Pressable key={item.location} onPress={() => setSelected(item)} style={[styles.locationCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.locationCardName, { color: colors.foreground }]}>{item.location.split(',')[0]}</Text><Text style={[styles.locationCardTemp, { color: colors.primary }]}>{item.temperature}°</Text><Text style={[styles.locationCardCondition, { color: colors.mutedForeground }]}>{item.condition}</Text></Pressable>)}</ScrollView>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, marginBottom: 20 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -0.8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 9, maxWidth: 340 },
  suggestions: { marginHorizontal: 18, marginTop: 8, borderWidth: 1, borderRadius: 15, overflow: 'hidden' },
  suggestion: { minHeight: 42, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 },
  suggestionText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  weatherHero: { margin: 20, marginBottom: 28, borderRadius: 24, borderWidth: 1, padding: 18 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between' },
  location: { fontFamily: 'Inter_700Bold', fontSize: 21, marginTop: 16 },
  condition: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 4 },
  sun: { width: 73, height: 73, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  tempRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 20 },
  temp: { fontFamily: 'Inter_700Bold', fontSize: 56, lineHeight: 60, letterSpacing: -2 },
  rainBlock: { alignItems: 'flex-end', paddingBottom: 5 },
  rainValue: { fontFamily: 'Inter_700Bold', fontSize: 23 },
  rainLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 3 },
  rainBar: { height: 7, borderRadius: 5, overflow: 'hidden', marginTop: 17 },
  rainFill: { height: '100%', borderRadius: 5 },
  status: { marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  note: { marginHorizontal: 18, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 28 },
  noteIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  noteText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  locationList: { gap: 10, paddingHorizontal: 18 },
  locationCard: { width: 135, borderWidth: 1, borderRadius: 17, padding: 13 },
  locationCardName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  locationCardTemp: { fontFamily: 'Inter_700Bold', fontSize: 22, marginTop: 14 },
  locationCardCondition: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
});