import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useSupabase } from '../providers/SupabaseProvider';

export function useAuthRedirect() {
  const { user, loading } = useSupabase();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to login if user is not authenticated and not in auth group
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Redirect to tabs if user is authenticated and in auth group
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);
}
