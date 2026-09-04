import { Feather, Ionicons } from '@expo/vector-icons';
import { Link, Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, PrimaryButton } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentUser, login, loading } = useTransit();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  if (loading) return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
  if (currentUser) return <Redirect href="/(tabs)" />;
  const submit = async () => {
    setError('');
    if (!email.trim() || !password) { setError('Enter your email and password to continue.'); return; }
    const result = await login(email, password);
    if (!result.ok) setError(result.message ?? 'Incorrect email or password.');
  };
  return <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
      <View style={styles.brandRow}><View style={[styles.brandMark, { backgroundColor: colors.primary }]}><Ionicons name="navigate" size={20} color={colors.primaryForeground} /></View><Text style={[styles.brand, { color: colors.foreground }]}>TransitPH</Text></View>
      <View style={styles.spacer} />
      <Text style={[styles.eyebrow, { color: colors.primary }]}>COMMUTE WITH CONFIDENCE</Text>
      <Text style={[styles.title, { color: colors.foreground }]}>Your next ride{'\n'}starts here.</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Find jeepney routes, terminals, and weather updates across CALABARZON.</Text>
      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Field label="Email address" icon="mail-outline" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Password" icon="lock-closed-outline" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" />
        {error ? <View style={styles.errorRow}><Feather name="alert-circle" size={15} color={colors.destructive} /><Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text></View> : null}
        <PrimaryButton label="Sign in" icon="arrow-right" onPress={submit} />
        <View style={styles.demoBox}><Text style={[styles.demoTitle, { color: colors.foreground }]}>Demo access</Text><Text style={[styles.demoText, { color: colors.mutedForeground }]}>user@transitph.test  ·  User123!</Text><Text style={[styles.demoText, { color: colors.mutedForeground }]}>admin@transitph.test  ·  Admin123!</Text></View>
      </View>
      <View style={styles.registerRow}><Text style={[styles.registerText, { color: colors.mutedForeground }]}>New to TransitPH?</Text><Link href="/register" asChild><Pressable><Text style={[styles.registerLink, { color: colors.primary }]}>Create account</Text></Pressable></Link></View>
    </ScrollView>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 22 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  brand: { fontFamily: 'Inter_700Bold', fontSize: 18, letterSpacing: -0.4 },
  spacer: { flex: 1, minHeight: 54 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1.6, marginBottom: 13 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 38, lineHeight: 42, letterSpacing: -1.4 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, marginTop: 15, maxWidth: 320 },
  form: { marginTop: 28, borderRadius: 22, borderWidth: 1, padding: 17, gap: 16 },
  errorRow: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  errorText: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 17 },
  demoBox: { gap: 4, paddingTop: 2 },
  demoTitle: { fontFamily: 'Inter_700Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  demoText: { fontFamily: 'Inter_400Regular', fontSize: 11 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingTop: 20 },
  registerText: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  registerLink: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});