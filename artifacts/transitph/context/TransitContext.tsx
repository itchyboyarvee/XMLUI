import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppUser, DEMO_USERS, hashPassword, routes as seedRoutes, Terminal, TransitRoute, terminals as seedTerminals } from '@/lib/data';

type SearchResult = { routes: TransitRoute[]; limited: boolean };
type TerminalInput = Omit<Terminal, 'id' | 'routeCount'>;
type RouteInput = Omit<TransitRoute, 'id'>;

interface TransitContextValue {
  currentUser: AppUser | null;
  users: AppUser[];
  terminals: Terminal[];
  routes: TransitRoute[];
  savedRouteIds: string[];
  remainingSearches: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (fullName: string, email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  searchRoutes: (from: string, to: string) => Promise<SearchResult>;
  saveRoute: (routeId: string) => Promise<void>;
  deleteSavedRoute: (routeId: string) => Promise<void>;
  addTerminal: (input: TerminalInput) => Promise<void>;
  updateTerminal: (id: string, input: TerminalInput) => Promise<void>;
  deleteTerminal: (id: string) => Promise<void>;
  addRoute: (input: RouteInput) => Promise<void>;
  updateRoute: (id: string, input: RouteInput) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
}

const STORAGE_KEY = 'transitph-state-v1';
const EMPTY_STATE = { users: DEMO_USERS, terminals: seedTerminals, routes: seedRoutes, savedRouteIds: [] as string[], searchesUsed: 0, searchWindowStartedAt: Date.now() };
const TransitContext = createContext<TransitContextValue | null>(null);

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TransitProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [users, setUsers] = useState<AppUser[]>(DEMO_USERS);
  const [terminals, setTerminals] = useState<Terminal[]>(seedTerminals);
  const [routes, setRoutes] = useState<TransitRoute[]>(seedRoutes);
  const [savedRouteIds, setSavedRouteIds] = useState<string[]>([]);
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [searchWindowStartedAt, setSearchWindowStartedAt] = useState(Date.now());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUsers(parsed.users ?? DEMO_USERS);
          setTerminals(parsed.terminals ?? seedTerminals);
          setRoutes(parsed.routes ?? seedRoutes);
          setSavedRouteIds(parsed.savedRouteIds ?? []);
          setSearchesUsed(parsed.searchesUsed ?? 0);
          setSearchWindowStartedAt(parsed.searchWindowStartedAt ?? Date.now());
          if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        } catch {
          // Reset to demo data if local state is not readable.
        }
      }
      setLoading(false);
    });
  }, []);

  const persist = (next: Partial<typeof EMPTY_STATE> & { currentUser?: AppUser | null }) => {
    const state = { users, terminals, routes, savedRouteIds, searchesUsed, searchWindowStartedAt, currentUser, ...next };
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const login = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find((item) => item.email.toLowerCase() === normalizedEmail);
    const acceptedDemo = (normalizedEmail === 'admin@transitph.test' && password === 'Admin123!') || (normalizedEmail === 'user@transitph.test' && password === 'User123!');
    if (!user || (!acceptedDemo && user.passwordHash !== hashPassword(password))) return { ok: false, message: 'Incorrect email or password.' };
    setCurrentUser(user);
    persist({ currentUser: user });
    return { ok: true };
  };

  const register = async (fullName: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((item) => item.email.toLowerCase() === normalizedEmail)) return { ok: false, message: 'An account with this email already exists.' };
    const user: AppUser = { id: makeId('user'), fullName: fullName.trim(), email: normalizedEmail, passwordHash: hashPassword(password), role: 'user' };
    const nextUsers = [...users, user];
    setUsers(nextUsers);
    setCurrentUser(user);
    persist({ users: nextUsers, currentUser: user });
    return { ok: true };
  };

  const logout = async () => {
    setCurrentUser(null);
    persist({ currentUser: null });
  };

  const searchRoutes = async (from: string, to: string): Promise<SearchResult> => {
    const now = Date.now();
    const windowExpired = now - searchWindowStartedAt >= 12 * 60 * 60 * 1000;
    const used = windowExpired ? 0 : searchesUsed;
    if (currentUser?.role !== 'admin' && used >= 5) return { routes: [], limited: true };
    const fromQuery = from.trim().toLowerCase();
    const toQuery = to.trim().toLowerCase();
    const ranked = routes.map((route) => {
      const terminal = terminals.find((item) => item.id === route.terminalId);
      const haystack = `${route.routeName} ${route.origin} ${route.destination} ${terminal?.name ?? ''} ${terminal?.city ?? ''}`.toLowerCase();
      const exactDestination = toQuery && haystack.includes(toQuery) ? 5 : 0;
      const exactOrigin = fromQuery && haystack.includes(fromQuery) ? 3 : 0;
      const tokenMatches = `${fromQuery} ${toQuery}`.split(/\s+/).filter(Boolean).reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
      return { route, score: exactDestination + exactOrigin + tokenMatches };
    }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || a.route.fare - b.route.fare).map((item) => item.route);
    const nextUsed = windowExpired ? 1 : used + 1;
    setSearchesUsed(nextUsed);
    if (windowExpired) setSearchWindowStartedAt(now);
    persist({ searchesUsed: nextUsed, searchWindowStartedAt: windowExpired ? now : searchWindowStartedAt });
    return { routes: ranked, limited: false };
  };

  const saveRoute = async (routeId: string) => {
    if (savedRouteIds.includes(routeId)) return;
    const next = [...savedRouteIds, routeId];
    setSavedRouteIds(next);
    persist({ savedRouteIds: next });
  };

  const deleteSavedRoute = async (routeId: string) => {
    const next = savedRouteIds.filter((id) => id !== routeId);
    setSavedRouteIds(next);
    persist({ savedRouteIds: next });
  };

  const addTerminal = async (input: TerminalInput) => {
    const next = [...terminals, { ...input, id: makeId('terminal'), routeCount: 0 }];
    setTerminals(next);
    persist({ terminals: next });
  };

  const updateTerminal = async (id: string, input: TerminalInput) => {
    const next = terminals.map((terminal) => terminal.id === id ? { ...terminal, ...input } : terminal);
    setTerminals(next);
    persist({ terminals: next });
  };

  const deleteTerminal = async (id: string) => {
    const nextTerminals = terminals.filter((terminal) => terminal.id !== id);
    const removedRouteIds = routes.filter((route) => route.terminalId === id).map((route) => route.id);
    const nextRoutes = routes.filter((route) => route.terminalId !== id);
    setTerminals(nextTerminals);
    setRoutes(nextRoutes);
    setSavedRouteIds((ids) => ids.filter((routeId) => !removedRouteIds.includes(routeId)));
    persist({ terminals: nextTerminals, routes: nextRoutes, savedRouteIds: savedRouteIds.filter((routeId) => !removedRouteIds.includes(routeId)) });
  };

  const addRoute = async (input: RouteInput) => {
    const next = [...routes, { ...input, id: makeId('route') }];
    setRoutes(next);
    persist({ routes: next });
  };

  const updateRoute = async (id: string, input: RouteInput) => {
    const next = routes.map((route) => route.id === id ? { ...route, ...input } : route);
    setRoutes(next);
    persist({ routes: next });
  };

  const deleteRoute = async (id: string) => {
    const next = routes.filter((route) => route.id !== id);
    const nextSaved = savedRouteIds.filter((routeId) => routeId !== id);
    setRoutes(next);
    setSavedRouteIds(nextSaved);
    persist({ routes: next, savedRouteIds: nextSaved });
  };

  const remainingSearches = currentUser?.role === 'admin' ? 99 : Math.max(0, 5 - searchesUsed);
  const value = useMemo(() => ({ currentUser, users, terminals, routes, savedRouteIds, remainingSearches, loading, login, register, logout, searchRoutes, saveRoute, deleteSavedRoute, addTerminal, updateTerminal, deleteTerminal, addRoute, updateRoute, deleteRoute }), [currentUser, users, terminals, routes, savedRouteIds, remainingSearches, loading]);
  return <TransitContext.Provider value={value}>{children}</TransitContext.Provider>;
}

export function useTransit() {
  const value = useContext(TransitContext);
  if (!value) throw new Error('useTransit must be used within TransitProvider');
  return value;
}