import { router } from 'expo-router';

// Navigation utilities following the pattern from galaxies.dev
export const navigation = {
  // Navigate to specific tabs
  goToHome: () => router.push('/(tabs)/' as any),
  goToTodos: () => router.push('/(tabs)/todos' as any),
  goToProfile: () => router.push('/(tabs)/profile' as any),
  
  // Navigate to feature screens
  goToUserManagement: () => router.push('/users' as any),
  
  // Navigate to modal screens
  openModal: () => router.push('/modal' as any),
  
  // Go back
  goBack: () => router.back(),
  
  // Replace current route
  replaceWith: (href: string) => router.replace(href as any),
  
  // Navigate with parameters
  navigateWithParams: (href: string, params?: Record<string, string>) => {
    if (params) {
      const searchParams = new URLSearchParams(params);
      router.push(`${href}?${searchParams.toString()}` as any);
    } else {
      router.push(href as any);
    }
  },
};

// Example usage:
// navigation.goToHome();
// navigation.goToChecklist();
// navigation.navigateWithParams('/profile', { userId: '123' });