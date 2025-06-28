import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Web-compatible storage adapter
const createWebStorage = () => {
  return {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return Promise.resolve(window.localStorage.getItem(key));
      }
      return Promise.resolve(null);
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
      return Promise.resolve();
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return Promise.resolve();
    },
    clear: () => {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
      return Promise.resolve();
    },
    getAllKeys: () => {
      if (typeof window !== 'undefined') {
        return Promise.resolve(Object.keys(window.localStorage));
      }
      return Promise.resolve([]);
    },
    multiGet: (keys: string[]) => {
      if (typeof window !== 'undefined') {
        const result = keys.map(key => [key, window.localStorage.getItem(key)] as const);
        return Promise.resolve(result);
      }
      return Promise.resolve(keys.map(key => [key, null] as const));
    },
    multiSet: (keyValuePairs: [string, string][]) => {
      if (typeof window !== 'undefined') {
        keyValuePairs.forEach(([key, value]) => {
          window.localStorage.setItem(key, value);
        });
      }
      return Promise.resolve();
    },
  };
};

// Export the appropriate storage based on platform
export const storage = Platform.OS === 'web' ? createWebStorage() : AsyncStorage;
