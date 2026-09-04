import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, Pill, PrimaryButton, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function RouteDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id, from, to } = useLocalSearchParams<{ id: string; from?: string; to?: string }>();
  const { routes, terminals, savedRouteIds, saveRoute, deleteSavedRoute } = useTransit();
  const route = routes.find((item) => item.id === id);
  if (!route) return <View style={[styles.center, { backgroundColor: colors.background }]}><Text style={[styles.missing, { color: colors.foreground }]}>Route not found.</Text></View>;
  const terminal = terminals.find((item) => item.id === route.terminalId);
  const saved = savedRouteIds.includes(route.id);
  const handleSave = async () => { if (saved) { await deleteSavedRoute(route.id); return; } await saveRoute(route.id); Alert.alert('Route saved successfully.', 'You can find it anytime in your profile.'); };
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
    <View style={styles.topBar}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><Text style={[styles.topLabel, { color: colors.mutedForeground }]}>ROUTE DETAILS</Text><View style={{ width: 40 }} /></View>
    <View style={[styles.routeHero, { backgroundColor: colors.card, borderColor: colors.border }]}><Pill tone="mint">{route.transfers ? '1 transfer' : 'Direct ride'}</Pill><Text style={[styles.heroTitle, { color: colors.foreground }]}>{from || route.origin} <Text style={{ color: colors.mutedForeground }}>to</Text> {to || route.destination}</Text><Text style={[styles.routeName, { color: colors.mutedForeground }]}>{route.routeName}</Text><View style={styles.routeLine}><View style={[styles.lineDot, { backgroundColor: colors.primary }]} /><View style={[styles.line, { backgroundColor: colors.accent }]} /><View style={[styles.lineDot, { backgroundColor: colors.accent }]} /></View><View style={styles.pointRow}><View><Text style={[styles.pointLabel, { color: colors.mutedForeground }]}>BOARD AT</Text><Text style={[styles.pointValue, { color: colors.foreground }]}>{terminal?.name ?? 'Terminal'}</Text></View><View style={{ alignItems: 'flex-end' }}><Text style={[styles.pointLabel, { color: colors.mutedForeground }]}>DROP OFF</Text><Text style={[styles.pointValue, { color: colors.foreground }]}>{route.destination}</Text></View></View></View>
    <SectionHeading title="Trip estimate" /><View style={styles.metrics}><Metric icon="credit-card" label="Est. fare" value={`₱${route.fare}`} /><Metric icon="clock" label="Travel time" value={route.estimatedTravelTime} /><Metric icon="move" label="Walking" value={route.walkingDistance} /></View>
    <SectionHeading title="Getting there" /><View style={[styles.instruction, { backgroundColor: colors.secondary }]}><View style={[styles.instructionIcon, { backgroundColor: colors.card }]}><Ionicons name="walk-outline" size={20} color={colors.secondaryForeground} /></View><Text style={[styles.instructionText, { color: colors.secondaryForeground }]}>Walk approximately {route.walkingDistance} to {terminal?.name ?? 'the terminal'}, then look for the {route.routeName} sign.</Text></View>
    <SectionHeading title="About this route" /><Text style={[styles.description, { color: colors.mutedForeground }]}>{route.description}</Text><Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>Fares, times, and walking estimates are sample information for this prototype and may change in real life.</Text>
    <View style={styles.actions}><PrimaryButton label={saved ? 'Remove saved route' : 'Save this route'} icon={saved ? 'bookmark' : 'bookmark'} onPress={() => void handleSave()} /><Pressable style={styles.share} onPress={() => Alert.alert('Route ready', 'Share actions will be connected in a future release.')}><Feather name="share-2" size={19} color={colors.foreground} /></Pressable></View>
  </ScrollView></View>;
}

function Metric({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) { const colors = useColors(); return <View style={styles.metric}><Feather name={icon} size={17} color={colors.primary} /><Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text><Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missing: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  topBar: { paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  topLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5 },
  routeHero: { marginHorizontal: 18, borderRadius: 24, borderWidth: 1, padding: 18, marginBottom: 27 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, letterSpacing: -0.8, marginTop: 17 },
  routeName: { fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 7 },
  routeLine: { flexDirection: 'row', alignItems: 'center', marginTop: 28 },
  lineDot: { width: 11, height: 11, borderRadius: 6 },
  line: { flex: 1, height: 3, marginHorizontal: 3 },
  pointRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  pointLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, letterSpacing: 1 },
  pointValue: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 4, maxWidth: 145 },
  metrics: { marginHorizontal: 18, borderRadius: 18, padding: 15, backgroundColor: '#ffffff0a', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 },
  metric: { flex: 1, gap: 5 },
  metricLabel: { fontFamily: 'Inter_400Regular', fontSize: 10 },
  metricValue: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  instruction: { marginHorizontal: 18, borderRadius: 17, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 27 },
  instructionIcon: { width: 37, height: 37, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  instructionText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 18 },
  description: { marginHorizontal: 18, fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20 },
  disclaimer: { marginHorizontal: 18, fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15, marginTop: 10 },
  actions: { flexDirection: 'row', gap: 10, marginHorizontal: 18, marginTop: 24 },
  share: { width: 52, height: 50, borderRadius: 16, borderWidth: 1, borderColor: '#ffffff20', alignItems: 'center', justifyContent: 'center' },
});