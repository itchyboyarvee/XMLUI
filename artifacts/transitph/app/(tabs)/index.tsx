import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, Pill, PrimaryButton, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, terminals, routes, savedRouteIds, remainingSearches, searchRoutes } = useTransit();
  const [from, setFrom] = useState('Calamba');
  const [to, setTo] = useState('Santa Rosa');
  const [error, setError] = useState('');
  const nearby = terminals.slice(0, 3);
  const saved = routes.filter((route) => savedRouteIds.includes(route.id)).slice(0, 2);
  const findRoute = async () => {
    setError('');
    if (!to.trim()) { setError('Please enter a destination.'); return; }
    const result = await searchRoutes(from, to);
    if (result.limited) { setError('You have reached your free route search limit. Upgrade to Premium for unlimited searches.'); return; }
    if (!result.routes.length) { setError('No available route was found for this destination.'); return; }
    router.push({ pathname: '/route/[id]', params: { id: result.routes[0].id, from, to } });
  };
  return <View style={[styles.screen, { backgroundColor: colors.background }]}>
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View><Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good day, {currentUser?.fullName.split(' ')[0] ?? 'commuter'}</Text><Text style={[styles.brand, { color: colors.foreground }]}>Transit<Text style={{ color: colors.primary }}>PH</Text></Text></View><Pressable testID="Profile shortcut" onPress={() => router.push('/(tabs)/profile')} style={[styles.avatar, { backgroundColor: colors.secondary }]}><Text style={[styles.avatarText, { color: colors.secondaryForeground }]}>{currentUser?.fullName.charAt(0) ?? 'T'}</Text></Pressable></View>
      <View style={[styles.hero, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.heroTop}><View><Pill tone="mint">CALABARZON · DEMO DATA</Pill><Text style={[styles.heroTitle, { color: colors.foreground }]}>Where are you{'\n'}headed?</Text></View><View style={[styles.heroOrb, { backgroundColor: `${colors.accent}38` }]}><Ionicons name="navigate" size={31} color={colors.accent} /></View></View>
        <View style={styles.form}><Field label="From" icon="location-outline" value={from} onChangeText={setFrom} placeholder="Current location" /><Field label="To" icon="flag-outline" value={to} onChangeText={setTo} placeholder="Enter destination" /><PrimaryButton label="Find a route" icon="arrow-up-right" onPress={findRoute} /></View>
        <View style={styles.limitRow}><View style={[styles.limitDot, { backgroundColor: colors.accent }]} /><Text style={[styles.limitText, { color: colors.mutedForeground }]}>{currentUser?.role === 'admin' ? 'Unlimited admin searches' : `Searches remaining: ${remainingSearches}/5`}</Text><Pressable onPress={() => router.push('/(tabs)/routes')}><Text style={[styles.link, { color: colors.primary }]}>View all</Text></Pressable></View>
        {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
      </View>
      <SectionHeading title="Nearby terminals" action="See all" onAction={() => router.push('/(tabs)/terminals')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
        {nearby.map((terminal) => <Pressable key={terminal.id} onPress={() => router.push({ pathname: '/terminal/[id]', params: { id: terminal.id } })} style={({ pressed }) => [styles.terminalCard, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.terminalIcon, { backgroundColor: `${colors.primary}18` }]}><Feather name="map-pin" size={17} color={colors.primary} /></View><Text numberOfLines={1} style={[styles.terminalName, { color: colors.foreground }]}>{terminal.name.replace(' Jeepney Terminal', '').replace(' Transport Hub', '')}</Text><Text style={[styles.terminalMeta, { color: colors.mutedForeground }]}>{terminal.city}, {terminal.province}</Text><View style={styles.cardFoot}><Text style={[styles.routeCount, { color: colors.secondaryForeground }]}>{terminal.routeCount} routes</Text><Feather name="chevron-right" size={15} color={colors.mutedForeground} /></View></Pressable>)}
      </ScrollView>
      <View style={styles.sectionGap} />
      <SectionHeading title="Weather snapshot" action="Open weather" onAction={() => router.push('/(tabs)/weather')} />
      <Pressable onPress={() => router.push('/(tabs)/weather')} style={[styles.weatherCard, { backgroundColor: colors.secondary }]}><View style={[styles.weatherIcon, { backgroundColor: colors.card }]}><Ionicons name="partly-sunny-outline" size={25} color={colors.primary} /></View><View style={styles.weatherInfo}><Text style={[styles.weatherLocation, { color: colors.foreground }]}>Santa Rosa, Laguna</Text><Text style={[styles.weatherDetail, { color: colors.secondaryForeground }]}>28°  ·  Partly cloudy</Text></View><View style={styles.weatherRight}><Text style={[styles.rain, { color: colors.secondaryForeground }]}>65%</Text><Text style={[styles.rainLabel, { color: colors.mutedForeground }]}>rain chance</Text></View></Pressable>
      <View style={styles.sectionGap} />
      <SectionHeading title="Saved routes" action="Manage" onAction={() => router.push('/(tabs)/profile')} />
      {saved.length ? saved.map((route) => <Pressable key={route.id} onPress={() => router.push({ pathname: '/route/[id]', params: { id: route.id, from: route.origin, to: route.destination } })} style={[styles.savedCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.savedLine, { backgroundColor: colors.accent }]} /><View style={styles.savedBody}><Text style={[styles.savedTitle, { color: colors.foreground }]}>{route.origin} <Text style={{ color: colors.mutedForeground }}>to</Text> {route.destination}</Text><Text style={[styles.savedMeta, { color: colors.mutedForeground }]}>{route.routeName}  ·  {route.estimatedTravelTime}</Text></View><Text style={[styles.savedFare, { color: colors.primary }]}>₱{route.fare}</Text></Pressable>) : <View style={[styles.savedEmpty, { borderColor: colors.border }]}><Text style={[styles.savedEmptyText, { color: colors.mutedForeground }]}>Your regular rides will appear here.</Text></View>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 21 },
  greeting: { fontFamily: 'Inter_500Medium', fontSize: 12, marginBottom: 3 },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.8 },
  avatar: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  hero: { borderRadius: 25, borderWidth: 1, padding: 18, marginBottom: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 27, lineHeight: 30, letterSpacing: -0.8, marginTop: 15 },
  heroOrb: { width: 67, height: 67, borderRadius: 25, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] },
  form: { gap: 12 },
  limitRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 16 },
  limitDot: { width: 7, height: 7, borderRadius: 4 },
  limitText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  error: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17, marginTop: 9 },
  horizontalList: { gap: 11, paddingRight: 8 },
  terminalCard: { width: 164, minHeight: 144, borderRadius: 19, borderWidth: 1, padding: 13 },
  terminalIcon: { width: 33, height: 33, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  terminalName: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: -0.2 },
  terminalMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  cardFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12 },
  routeCount: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  sectionGap: { height: 27 },
  weatherCard: { borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center' },
  weatherIcon: { width: 47, height: 47, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  weatherInfo: { flex: 1, marginLeft: 11 },
  weatherLocation: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  weatherDetail: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 5 },
  weatherRight: { alignItems: 'flex-end' },
  rain: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  rainLabel: { fontFamily: 'Inter_400Regular', fontSize: 9, marginTop: 2 },
  savedCard: { borderWidth: 1, borderRadius: 17, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  savedLine: { width: 4, height: 35, borderRadius: 2, marginRight: 11 },
  savedBody: { flex: 1 },
  savedTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  savedMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 5 },
  savedFare: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  savedEmpty: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 17, padding: 19, alignItems: 'center' },
  savedEmptyText: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  pressed: { opacity: 0.72 },
});
