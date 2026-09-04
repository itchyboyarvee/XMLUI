import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState, Pill, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, routes, savedRouteIds, deleteSavedRoute, logout } = useTransit();
  const saved = routes.filter((route) => savedRouteIds.includes(route.id));
  const signOut = () => Alert.alert('Sign out', 'Are you sure you want to sign out of TransitPH?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Sign out', style: 'destructive', onPress: () => void logout() }]);
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{currentUser?.fullName.charAt(0) ?? 'T'}</Text></View><View style={styles.userInfo}><Text style={[styles.name, { color: colors.foreground }]}>{currentUser?.fullName}</Text><Text style={[styles.email, { color: colors.mutedForeground }]}>{currentUser?.email}</Text></View><Pill tone={currentUser?.role === 'admin' ? 'orange' : 'mint'}>{currentUser?.role ?? 'user'}</Pill></View>
    {currentUser?.role === 'admin' ? <Pressable onPress={() => router.push('/admin')} style={({ pressed }) => [styles.adminCard, { backgroundColor: colors.secondary }, pressed && styles.pressed]}><View style={[styles.adminIcon, { backgroundColor: colors.card }]}><Feather name="shield" size={18} color={colors.secondaryForeground} /></View><View style={styles.adminCopy}><Text style={[styles.adminTitle, { color: colors.foreground }]}>Admin workspace</Text><Text style={[styles.adminText, { color: colors.secondaryForeground }]}>Manage terminals and routes</Text></View><Feather name="arrow-up-right" size={18} color={colors.secondaryForeground} /></Pressable> : null}
    <SectionHeading title="Saved routes" /><Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>{saved.length ? 'Your shortcuts for the rides you take most.' : 'Save a route to see it here.'}</Text>
    {saved.length ? saved.map((route) => <View key={route.id} style={[styles.saved, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.routeIcon, { backgroundColor: `${colors.accent}28` }]}><Feather name="navigation" size={16} color={colors.accentForeground} /></View><View style={styles.savedBody}><Text style={[styles.savedTitle, { color: colors.foreground }]}>{route.origin} to {route.destination}</Text><Text style={[styles.savedMeta, { color: colors.mutedForeground }]}>{route.routeName} · ₱{route.fare} · {route.estimatedTravelTime}</Text></View><Pressable accessibilityLabel="Delete saved route" testID="Delete saved route" onPress={() => void deleteSavedRoute(route.id)}><Feather name="trash-2" size={17} color={colors.destructive} /></Pressable></View>) : <EmptyState icon="bookmark" title="No saved routes yet" body="Use the bookmark action on a route result to save your commute." />}
    <View style={styles.divider} /><Pressable onPress={signOut} style={({ pressed }) => [styles.signOut, pressed && styles.pressed]}><Feather name="log-out" size={18} color={colors.destructive} /><Text style={[styles.signOutText, { color: colors.destructive }]}>Sign out</Text></Pressable><Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>TransitPH is a 30% prototype using clearly labelled sample data. Please verify routes and fares before travelling.</Text>
  </ScrollView></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { marginHorizontal: 18, padding: 17, borderRadius: 22, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 24 },
  avatar: { width: 54, height: 54, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 21 },
  userInfo: { flex: 1 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 17 },
  email: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 4 },
  adminCard: { marginHorizontal: 18, padding: 13, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 29 },
  adminIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  adminCopy: { flex: 1 },
  adminTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  adminText: { fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 3 },
  sectionSub: { marginHorizontal: 18, fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: -6, marginBottom: 15 },
  saved: { marginHorizontal: 18, padding: 13, borderRadius: 17, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  routeIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  savedBody: { flex: 1 },
  savedTitle: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  savedMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#ffffff14', marginHorizontal: 18, marginTop: 26, marginBottom: 17 },
  signOut: { marginHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11 },
  signOutText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  disclaimer: { fontFamily: 'Inter_400Regular', fontSize: 10, lineHeight: 15, textAlign: 'center', paddingHorizontal: 35, paddingTop: 20 },
  pressed: { opacity: 0.72 },
});