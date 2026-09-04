import { Feather } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, IconButton, Pill, PrimaryButton, SectionHeading } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { Terminal, TransitRoute } from '@/lib/data';
import { useTransit } from '@/context/TransitContext';

type Panel = 'terminals' | 'routes';

const blankTerminal = { name: '', city: '', province: 'Laguna', latitude: 14.21, longitude: 121.16, description: '' };
const blankRoute = { terminalId: '', routeName: '', origin: '', destination: '', fare: 20, estimatedTravelTime: '30 min', walkingDistance: '400 m', transfers: 0, description: '' };

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, terminals, routes, addTerminal, updateTerminal, deleteTerminal, addRoute, updateRoute, deleteRoute } = useTransit();
  const [panel, setPanel] = useState<Panel>('terminals');
  const [terminalModal, setTerminalModal] = useState(false);
  const [routeModal, setRouteModal] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState<Terminal | null>(null);
  const [editingRoute, setEditingRoute] = useState<TransitRoute | null>(null);
  if (currentUser?.role !== 'admin') return <Redirect href="/" />;

  const openTerminal = (terminal?: Terminal) => { setEditingTerminal(terminal ?? null); setTerminalModal(true); };
  const openRoute = (route?: TransitRoute) => { setEditingRoute(route ?? null); setRouteModal(true); };
  const confirmDeleteTerminal = (terminal: Terminal) => Alert.alert('Delete terminal?', `This will also remove routes belonging to ${terminal.name}.`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void deleteTerminal(terminal.id) }]);
  const confirmDeleteRoute = (route: TransitRoute) => Alert.alert('Delete route?', `Remove ${route.routeName} from the route directory?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => void deleteRoute(route.id) }]);
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: insets.bottom + 34 }} showsVerticalScrollIndicator={false}>
    <View style={styles.topBar}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ADMIN ONLY</Text><Text style={[styles.title, { color: colors.foreground }]}>Manage TransitPH</Text></View><View style={{ width: 40 }} /></View>
    <View style={[styles.notice, { backgroundColor: colors.secondary }]}><Feather name="shield" size={16} color={colors.secondaryForeground} /><Text style={[styles.noticeText, { color: colors.secondaryForeground }]}>Changes are stored locally on this device for the prototype.</Text></View>
    <View style={[styles.switcher, { backgroundColor: colors.card, borderColor: colors.border }]}><Pressable onPress={() => setPanel('terminals')} style={[styles.switchButton, panel === 'terminals' && { backgroundColor: colors.primary }]}><Text style={[styles.switchText, { color: panel === 'terminals' ? colors.primaryForeground : colors.mutedForeground }]}>Terminals</Text></Pressable><Pressable onPress={() => setPanel('routes')} style={[styles.switchButton, panel === 'routes' && { backgroundColor: colors.primary }]}><Text style={[styles.switchText, { color: panel === 'routes' ? colors.primaryForeground : colors.mutedForeground }]}>Routes</Text></Pressable></View>
    {panel === 'terminals' ? <><SectionHeading title={`${terminals.length} terminals`} action="Add terminal" onAction={() => openTerminal()} />{terminals.map((terminal) => <View key={terminal.id} style={[styles.adminCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.itemIcon, { backgroundColor: `${colors.primary}18` }]}><Feather name="map-pin" size={17} color={colors.primary} /></View><View style={styles.itemBody}><Text style={[styles.itemName, { color: colors.foreground }]}>{terminal.name}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>{terminal.city}, {terminal.province} · {terminal.routeCount} routes</Text></View><Pressable accessibilityLabel="Edit terminal" testID="Edit terminal" onPress={() => openTerminal(terminal)} style={styles.action}><Feather name="edit-2" size={16} color={colors.foreground} /></Pressable><Pressable accessibilityLabel="Delete terminal" testID="Delete terminal" onPress={() => confirmDeleteTerminal(terminal)} style={styles.action}><Feather name="trash-2" size={16} color={colors.destructive} /></Pressable></View>)}</> : <><SectionHeading title={`${routes.length} routes`} action="Add route" onAction={() => openRoute()} />{routes.map((route) => <View key={route.id} style={[styles.adminCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.itemIcon, { backgroundColor: `${colors.accent}28` }]}><Feather name="navigation" size={17} color={colors.accentForeground} /></View><View style={styles.itemBody}><Text style={[styles.itemName, { color: colors.foreground }]}>{route.routeName}</Text><Text style={[styles.itemMeta, { color: colors.mutedForeground }]}>₱{route.fare} · {route.estimatedTravelTime} · {route.destination}</Text></View><Pressable accessibilityLabel="Edit route" testID="Edit route" onPress={() => openRoute(route)} style={styles.action}><Feather name="edit-2" size={16} color={colors.foreground} /></Pressable><Pressable accessibilityLabel="Delete route" testID="Delete route" onPress={() => confirmDeleteRoute(route)} style={styles.action}><Feather name="trash-2" size={16} color={colors.destructive} /></Pressable></View>)}</>}
  </ScrollView>
  <TerminalModal visible={terminalModal} terminal={editingTerminal} onClose={() => setTerminalModal(false)} onSave={async (input) => { if (editingTerminal) await updateTerminal(editingTerminal.id, input); else await addTerminal(input); setTerminalModal(false); }} />
  <RouteModal visible={routeModal} route={editingRoute} terminals={terminals} onClose={() => setRouteModal(false)} onSave={async (input) => { if (editingRoute) await updateRoute(editingRoute.id, input); else await addRoute(input); setRouteModal(false); }} />
  </View>;
}

function TerminalModal({ visible, terminal, onClose, onSave }: { visible: boolean; terminal: Terminal | null; onClose: () => void; onSave: (input: Omit<Terminal, 'id' | 'routeCount'>) => Promise<void> }) {
  const colors = useColors();
  const [form, setForm] = useState(blankTerminal);
  React.useEffect(() => { if (visible) setForm(terminal ? { name: terminal.name, city: terminal.city, province: terminal.province, latitude: terminal.latitude, longitude: terminal.longitude, description: terminal.description } : blankTerminal); }, [visible, terminal]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: key === 'latitude' || key === 'longitude' ? Number(value) || 0 : value }));
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.background }]}><View style={styles.modalHeader}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>DIRECTORY</Text><Text style={[styles.modalTitle, { color: colors.foreground }]}>{terminal ? 'Edit terminal' : 'Add terminal'}</Text></View><IconButton icon="x" label="Close" onPress={onClose} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}><Field label="Terminal name" value={form.name} onChangeText={(value) => update('name', value)} placeholder="Terminal name" /><Field label="City / municipality" value={form.city} onChangeText={(value) => update('city', value)} placeholder="City" /><Field label="Province" value={form.province} onChangeText={(value) => update('province', value)} placeholder="Province" /><View style={styles.twoCol}><View style={{ flex: 1 }}><Field label="Latitude" value={String(form.latitude)} onChangeText={(value) => update('latitude', value)} keyboardType="decimal-pad" placeholder="14.21" /></View><View style={{ flex: 1 }}><Field label="Longitude" value={String(form.longitude)} onChangeText={(value) => update('longitude', value)} keyboardType="decimal-pad" placeholder="121.16" /></View></View><Field label="Description" value={form.description} onChangeText={(value) => update('description', value)} placeholder="Location details" multiline /><PrimaryButton label={terminal ? 'Save terminal' : 'Create terminal'} icon="check" onPress={() => void onSave(form)} /></ScrollView></View></View></Modal>;
}

function RouteModal({ visible, route, terminals, onClose, onSave }: { visible: boolean; route: TransitRoute | null; terminals: Terminal[]; onClose: () => void; onSave: (input: Omit<TransitRoute, 'id'>) => Promise<void> }) {
  const colors = useColors();
  const [form, setForm] = useState(blankRoute);
  React.useEffect(() => { if (visible) setForm(route ? { terminalId: route.terminalId, routeName: route.routeName, origin: route.origin, destination: route.destination, fare: route.fare, estimatedTravelTime: route.estimatedTravelTime, walkingDistance: route.walkingDistance, transfers: route.transfers, description: route.description } : { ...blankRoute, terminalId: terminals[0]?.id ?? '', origin: terminals[0]?.city ?? '' }); }, [visible, route, terminals]);
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: key === 'fare' || key === 'transfers' ? Number(value) || 0 : value }));
  return <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}><View style={styles.modalBackdrop}><View style={[styles.modal, { backgroundColor: colors.background }]}><View style={styles.modalHeader}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>DIRECTORY</Text><Text style={[styles.modalTitle, { color: colors.foreground }]}>{route ? 'Edit route' : 'Add route'}</Text></View><IconButton icon="x" label="Close" onPress={onClose} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalContent}><Field label="Route name" value={form.routeName} onChangeText={(value) => update('routeName', value)} placeholder="Calamba – Santa Rosa" /><Field label="Origin" value={form.origin} onChangeText={(value) => update('origin', value)} placeholder="Starting city" /><Field label="Destination" value={form.destination} onChangeText={(value) => update('destination', value)} placeholder="Destination" /><Text style={[styles.selectLabel, { color: colors.mutedForeground }]}>Terminal</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>{terminals.map((terminal) => <Pressable key={terminal.id} onPress={() => setForm((current) => ({ ...current, terminalId: terminal.id, origin: current.origin || terminal.city }))}><Pill tone={form.terminalId === terminal.id ? 'orange' : 'neutral'}>{terminal.city}</Pill></Pressable>)}</ScrollView><View style={styles.twoCol}><View style={{ flex: 1 }}><Field label="Fare (PHP)" value={String(form.fare)} onChangeText={(value) => update('fare', value)} keyboardType="number-pad" placeholder="30" /></View><View style={{ flex: 1 }}><Field label="Transfers" value={String(form.transfers)} onChangeText={(value) => update('transfers', value)} keyboardType="number-pad" placeholder="0" /></View></View><View style={styles.twoCol}><View style={{ flex: 1 }}><Field label="Travel time" value={form.estimatedTravelTime} onChangeText={(value) => update('estimatedTravelTime', value)} placeholder="45 min" /></View><View style={{ flex: 1 }}><Field label="Walking" value={form.walkingDistance} onChangeText={(value) => update('walkingDistance', value)} placeholder="500 m" /></View></View><Field label="Description" value={form.description} onChangeText={(value) => update('description', value)} placeholder="Route details" multiline /><PrimaryButton label={route ? 'Save route' : 'Create route'} icon="check" onPress={() => void onSave(form)} /></ScrollView></View></View></Modal>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: { paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 5 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.7 },
  notice: { marginHorizontal: 18, padding: 13, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  noticeText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16 },
  switcher: { marginHorizontal: 18, borderRadius: 14, borderWidth: 1, padding: 4, flexDirection: 'row', marginBottom: 25 },
  switchButton: { flex: 1, minHeight: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  switchText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  adminCard: { marginHorizontal: 18, borderRadius: 17, borderWidth: 1, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 },
  itemIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  itemBody: { flex: 1 },
  itemName: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  itemMeta: { fontFamily: 'Inter_400Regular', fontSize: 10, marginTop: 4 },
  action: { width: 31, height: 35, alignItems: 'center', justifyContent: 'center' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000088' },
  modal: { maxHeight: '92%', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 16 },
  modalHeader: { paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  modalContent: { paddingHorizontal: 20, paddingBottom: 30, gap: 13 },
  twoCol: { flexDirection: 'row', gap: 10 },
  selectLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  chips: { gap: 7, paddingBottom: 2 },
});