import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Generic storage methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      throw error;
    }
  }

  async multiGet(keys: string[]): Promise<readonly (readonly [string, string | null])[]> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple items:', error);
      throw error;
    }
  }

  async multiSet(keyValuePairs: [string, string][]): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple items:', error);
      throw error;
    }
  }

  // Specific storage keys
  static readonly KEYS = {
    USER_PREFERENCES: 'user_preferences',
    CHECKLIST_CACHE: 'checklist_cache',
    AUTH_TOKEN: 'auth_token',
    USER_PROFILE: 'user_profile',
    OFFLINE_CHECKLISTS: 'offline_checklists',
    APP_SETTINGS: 'app_settings',
  } as const;

  // Helper methods for specific data types
  async setUserPreferences(preferences: any): Promise<void> {
    return this.setItem(StorageService.KEYS.USER_PREFERENCES, preferences);
  }

  async getUserPreferences(): Promise<any | null> {
    return this.getItem(StorageService.KEYS.USER_PREFERENCES);
  }

  async setChecklistCache(checklists: any[]): Promise<void> {
    return this.setItem(StorageService.KEYS.CHECKLIST_CACHE, checklists);
  }

  async getChecklistCache(): Promise<any[] | null> {
    return this.getItem(StorageService.KEYS.CHECKLIST_CACHE);
  }

  async setAuthToken(token: string): Promise<void> {
    return this.setItem(StorageService.KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getItem(StorageService.KEYS.AUTH_TOKEN);
  }

  async clearAuthData(): Promise<void> {
    await Promise.all([
      this.removeItem(StorageService.KEYS.AUTH_TOKEN),
      this.removeItem(StorageService.KEYS.USER_PROFILE),
    ]);
  }
}

export const storageService = new StorageService();
