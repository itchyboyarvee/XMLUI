import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, Field, Pill, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function TerminalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { terminals, routes } = useTransit();
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => terminals.filter((terminal) => `${terminal.name} ${terminal.city} ${terminal.province}`.toLowerCase().includes(query.toLowerCase())), [query, terminals]);
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Text style={[styles.eyebrow, { color: colors.primary }]}>DISCOVER</Text><Text style={[styles.title, { color: colors.foreground }]}>Terminals near you</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Explore sample commuter hubs across the five CALABARZON provinces.</Text></View>
    <View style={{ paddingHorizontal: 18, marginBottom: 22 }}><Field label="Search terminals" icon="search" value={query} onChangeText={setQuery} placeholder="Try Calamba or Cavite" /></View>
    <SectionHeading title={`${filtered.length} terminals`} />
    {filtered.length ? filtered.map((terminal) => <Pressable key={terminal.id} onPress={() => router.push({ pathname: '/terminal/[id]', params: { id: terminal.id } })} style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.icon, { backgroundColor: `${colors.primary}18` }]}><Feather name="map-pin" size={19} color={colors.primary} /></View><View style={styles.body}><Text style={[styles.name, { color: colors.foreground }]}>{terminal.name}</Text><Text style={[styles.meta, { color: colors.mutedForeground }]}>{terminal.city}, {terminal.province}</Text><Text numberOfLines={2} style={[styles.description, { color: colors.mutedForeground }]}>{terminal.description}</Text><View style={styles.bottom}><Pill tone="mint">{routes.filter((route) => route.terminalId === terminal.id).length || terminal.routeCount} routes</Pill><Text style={[styles.coordinates, { color: colors.mutedForeground }]}>{terminal.latitude.toFixed(3)}, {terminal.longitude.toFixed(3)}</Text></View></View><Feather name="chevron-right" size={18} color={colors.mutedForeground} /></Pressable>) : <EmptyState icon="map-pin" title="No terminals found" body="Try a city, province, or terminal keyword." />}
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, marginBottom: 20 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -0.8 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, marginTop: 9, maxWidth: 340 },
  card: { marginHorizontal: 18, borderWidth: 1, borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 11 },
  icon: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  body: { flex: 1 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 14, lineHeight: 19, paddingRight: 7 },
  meta: { fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 4 },
  description: { fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 16, marginTop: 9 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 11 },
  coordinates: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  pressed: { opacity: 0.72 },
});