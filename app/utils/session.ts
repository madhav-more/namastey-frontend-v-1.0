"use client";
import { useMemo, useSyncExternalStore } from 'react';
import type { UserProfile } from './types';
const subscribe = (listener: () => void) => { window.addEventListener('storage', listener); return () => window.removeEventListener('storage', listener); };
const readUser = () => { try { return localStorage.getItem('namastey_token') ? localStorage.getItem('namastey_user') : null; } catch { return null; } };
export function useSession() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribe, readUser, () => null);
  const user = useMemo(() => { try { return raw ? JSON.parse(raw) as UserProfile : null; } catch { return null; } }, [raw]);
  return { isClient, user };
}
