import { router } from 'expo-router';

// Navigation utilities following the pattern from galaxies.dev
export const navigation = {
  // Navigate to specific tabs
  goToHome: () => router.push('/(tabs)/'),
  goToChecklist: () => router.push('/(tabs)/checklist'),
  goToProfile: () => router.push('/(tabs)/profile'),
  
  // Navigate to feature screens
  goToUserManagement: () => router.push('/users'),
  
  // Navigate to modal screens
  openModal: () => router.push('/modal'),
  
  // Go back
  goBack: () => router.back(),
  
  // Replace current route
  replaceWith: (href: string) => router.replace(href),
  
  // Navigate with parameters
  navigateWithParams: (href: string, params?: Record<string, string>) => {
    if (params) {
      const searchParams = new URLSearchParams(params);
      router.push(`${href}?${searchParams.toString()}`);
    } else {
      router.push(href);
    }
  },
};

// Example usage:
// navigation.goToHome();
// navigation.goToChecklist();
// navigation.navigateWithParams('/profile', { userId: '123' });
