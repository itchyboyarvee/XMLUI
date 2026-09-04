import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, EmptyState, Pill, PrimaryButton, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { TransitRoute } from '@/lib/data';
import { useTransit } from '@/context/TransitContext';

export default function RoutesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, remainingSearches, searchRoutes, terminals, saveRoute, savedRouteIds } = useTransit();
  const [from, setFrom] = useState('Calamba');
  const [to, setTo] = useState('Santa Rosa');
  const [results, setResults] = useState<TransitRoute[] | null>(null);
  const [message, setMessage] = useState('');
  const [searching, setSearching] = useState(false);
  const submit = async () => {
    setMessage('');
    if (!to.trim()) { setMessage('Please enter a destination.'); return; }
    setSearching(true);
    const result = await searchRoutes(from, to);
    setSearching(false);
    if (result.limited) { setMessage('You have reached your free route search limit. Upgrade to Premium for unlimited searches.'); setResults([]); return; }
    if (!result.routes.length) setMessage('No available route was found for this destination.');
    setResults(result.routes);
  };
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ROUTE FINDER</Text><Text style={[styles.title, { color: colors.foreground }]}>Plan your ride</Text></View><View style={[styles.searchBadge, { backgroundColor: colors.secondary }]}><Feather name="search" size={14} color={colors.secondaryForeground} /><Text style={[styles.searchBadgeText, { color: colors.secondaryForeground }]}>{currentUser?.role === 'admin' ? '∞' : remainingSearches}</Text></View></View>
    <View style={[styles.findBox, { backgroundColor: colors.card, borderColor: colors.border }]}><Field label="From" icon="navigate" value={from} onChangeText={setFrom} placeholder="Starting point" /><Field label="To" icon="flag" value={to} onChangeText={setTo} placeholder="Destination" /><PrimaryButton label={searching ? 'Searching...' : 'Find available routes'} icon="arrow-up-right" disabled={searching} onPress={submit} />{message ? <Text style={[styles.message, { color: colors.destructive }]}>{message}</Text> : null}</View>
    {results === null ? <View style={[styles.tip, { backgroundColor: colors.secondary }]}><Feather name="info" size={16} color={colors.secondaryForeground} /><Text style={[styles.tipText, { color: colors.secondaryForeground }]}>Search by city, terminal, or destination. Results use demo CALABARZON route data.</Text></View> : null}
    {results !== null ? <><SectionHeading title={`${results.length} routes found`} action="Clear" onAction={() => { setResults(null); setMessage(''); }} />{results.length ? results.map((route) => <RouteResult key={route.id} route={route} terminalName={terminals.find((terminal) => terminal.id === route.terminalId)?.name ?? 'Terminal'} saved={savedRouteIds.includes(route.id)} onSave={() => void saveRoute(route.id)} onView={() => router.push({ pathname: '/route/[id]', params: { id: route.id, from, to } })} />) : <EmptyState icon="map" title="No route found" body="Try a nearby city, terminal name, or a shorter destination keyword." />}</> : null}
  </ScrollView></View>;
}

function RouteResult({ route, terminalName, saved, onSave, onView }: { route: TransitRoute; terminalName: string; saved: boolean; onSave: () => void; onView: () => void }) {
  const colors = useColors();
  return <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.resultTop}><Pill tone="mint">{route.transfers ? '1 transfer' : 'Direct ride'}</Pill><Pressable accessibilityLabel="Save route" testID="Save route" onPress={onSave}><Feather name={saved ? 'bookmark' : 'bookmark'} size={20} color={saved ? colors.primary : colors.mutedForeground} /></Pressable></View><Text style={[styles.routeName, { color: colors.foreground }]}>{route.routeName}</Text><View style={styles.destinationRow}><Feather name="map-pin" size={14} color={colors.primary} /><Text style={[styles.terminal, { color: colors.mutedForeground }]}>{terminalName}</Text></View><View style={styles.metrics}><Metric label="Fare" value={`₱${route.fare}`} /><Metric label="Travel" value={route.estimatedTravelTime} /><Metric label="Walk" value={route.walkingDistance} /></View><Pressable onPress={onView} style={({ pressed }) => [styles.viewButton, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><Text style={[styles.viewButtonText, { color: colors.secondaryForeground }]}>View route details</Text><Feather name="arrow-up-right" size={15} color={colors.secondaryForeground} /></Pressable></View>;
}

function Metric({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return <View style={styles.metric}><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 29, letterSpacing: -0.8 },
  searchBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 14, paddingHorizontal: 11, paddingVertical: 9 },
  searchBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  findBox: { marginHorizontal: 18, borderWidth: 1, borderRadius: 22, padding: 16, gap: 12 },
  message: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  tip: { margin: 18, padding: 13, borderRadius: 15, flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  tipText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 17 },
  resultCard: { marginHorizontal: 18, borderWidth: 1, borderRadius: 21, padding: 16, marginBottom: 12 },
  resultTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  routeName: { fontFamily: 'Inter_700Bold', fontSize: 17, marginTop: 13 },
  destinationRow: { flexDirection: 'row', gap: 7, alignItems: 'center', marginTop: 8 },
  terminal: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ffffff16', paddingVertical: 13, marginTop: 16 },
  metric: { flex: 1 },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, marginBottom: 4 },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  viewButton: { marginTop: 13, borderRadius: 12, minHeight: 38, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  viewButtonText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  pressed: { opacity: 0.72 },
});