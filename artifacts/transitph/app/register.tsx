import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Field, IconButton, PrimaryButton } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { useTransit } from '@/context/TransitContext';

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { register } = useTransit();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const submit = async () => {
    if (!fullName.trim() || !email.trim() || !password || !confirm) { setError('Please complete every field.'); return; }
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    const result = await register(fullName, email, password);
    if (!result.ok) { setError(result.message ?? 'Something went wrong. Please try again.'); return; }
    router.replace('/(tabs)');
  };
  return <KeyboardAvoidingView style={[styles.screen, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><View><Text style={[styles.eyebrow, { color: colors.primary }]}>WELCOME ABOARD</Text><Text style={[styles.title, { color: colors.foreground }]}>Create your account</Text></View></View>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Save your regular routes and get a calmer commute across the region.</Text>
      <View style={[styles.form, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Field label="Full name" icon="person" value={fullName} onChangeText={setFullName} placeholder="Your name" />
        <Field label="Email address" icon="mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Password" icon="lock-closed" value={password} onChangeText={setPassword} secureTextEntry placeholder="At least 6 characters" />
        <Field label="Confirm password" icon="checkmark-circle" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" />
        {error ? <View style={styles.errorRow}><Feather name="alert-circle" size={15} color={colors.destructive} /><Text style={[styles.error, { color: colors.destructive }]}>{error}</Text></View> : null}
        <PrimaryButton label="Create account" icon="arrow-right" onPress={submit} />
      </View>
      <View style={styles.footer}><Text style={[styles.footerText, { color: colors.mutedForeground }]}>Already have an account?</Text><Pressable onPress={() => router.back()}><Text style={[styles.footerLink, { color: colors.primary }]}>Sign in</Text></Pressable></View>
    </ScrollView>
  </KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 15 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 25, letterSpacing: -0.6 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, paddingHorizontal: 22, marginTop: 20 },
  form: { marginHorizontal: 22, marginTop: 24, padding: 17, borderRadius: 22, borderWidth: 1, gap: 16 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  error: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 5, paddingTop: 20 },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 13 },
  footerLink: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});