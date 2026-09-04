import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export function IconButton({ icon, onPress, label, color, size = 20 }: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label: string; color?: string; size?: number }) {
  const colors = useColors();
  return <Pressable accessibilityLabel={label} testID={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><Feather name={icon} size={size} color={color ?? colors.foreground} /></Pressable>;
}

export function PrimaryButton({ label, onPress, icon, disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof Feather.glyphMap; disabled?: boolean }) {
  const colors = useColors();
  return <Pressable testID={label} accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, disabled && styles.disabled, pressed && styles.pressed]}>{icon ? <Feather name={icon} size={17} color={colors.primaryForeground} /> : null}<Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{label}</Text></Pressable>;
}

export function Field({ label, icon, ...props }: TextInputProps & { label: string; icon?: keyof typeof Ionicons.glyphMap }) {
  const colors = useColors();
  return <View style={styles.fieldWrap}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text><View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.border }]}>{icon ? <Ionicons name={icon} size={18} color={colors.mutedForeground} /> : null}<TextInput {...props} placeholderTextColor={colors.mutedForeground} style={[styles.input, { color: colors.foreground }]} /></View></View>;
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionHeading}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>{action && onAction ? <Pressable onPress={onAction}><Text style={[styles.link, { color: colors.primary }]}>{action}</Text></Pressable> : null}</View>;
}

export function Pill({ children, tone = 'mint' }: { children: React.ReactNode; tone?: 'mint' | 'orange' | 'neutral' }) {
  const colors = useColors();
  const backgroundColor = tone === 'orange' ? `${colors.primary}22` : tone === 'mint' ? `${colors.accent}30` : colors.muted;
  const color = tone === 'orange' ? colors.primary : tone === 'mint' ? colors.accentForeground : colors.mutedForeground;
  return <View style={[styles.pill, { backgroundColor }]}><Text style={[styles.pillText, { color }]}>{children}</Text></View>;
}

export function EmptyState({ icon = 'map-pin', title, body }: { icon?: keyof typeof Feather.glyphMap; title: string; body: string }) {
  const colors = useColors();
  return <View style={styles.empty}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={24} color={colors.secondaryForeground} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>{body}</Text></View>;
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>;
}

const styles = StyleSheet.create({
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.72 },
  primaryButton: { minHeight: 50, borderRadius: 16, paddingHorizontal: 18, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 14, letterSpacing: 0.2 },
  disabled: { opacity: 0.45 },
  fieldWrap: { gap: 7 },
  fieldLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  field: { minHeight: 52, borderWidth: 1, borderRadius: 15, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 15, paddingVertical: 11 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 18 },
  link: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 30, alignSelf: 'flex-start' },
  pillText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.4, textTransform: 'uppercase' },
  empty: { paddingVertical: 34, alignItems: 'center', gap: 8 },
  emptyIcon: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  emptyBody: { fontFamily: 'Inter_400Regular', fontSize: 13, textAlign: 'center', lineHeight: 19, maxWidth: 280 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export const sharedStyles = styles;