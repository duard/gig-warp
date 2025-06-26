// Configuration management using environment variables

export const config = {
  // Supabase configuration
  supabase: {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL,
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // API configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000/api',
  },
  
  // App configuration
  app: {
    name: 'MyTabsApp',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    secretKey: process.env.SECRET_KEY,
    debug: process.env.NODE_ENV !== 'production',
  },
  
  // Feature flags (you can use these to enable/disable features)
  features: {
    userManagement: true,
    checklists: true,
    notifications: process.env.VAR_BOOL === 'true',
  },
  
  // Validation helpers
  validation: {
    isValidSupabaseConfig(): boolean {
      return !!(this.supabase.url && this.supabase.anonKey);
    },
    
    getRequiredEnvVar(key: string): string {
      const value = process.env[key];
      if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
      return value;
    },
    
    getEnvVar(key: string, defaultValue?: string): string | undefined {
      return process.env[key] || defaultValue;
    },
  },
} as const;

// Validate critical configuration on module load
if (!config.validation.isValidSupabaseConfig()) {
  console.warn('⚠️  Supabase configuration is incomplete. Please check your environment variables.');
}

// Log configuration in development
if (config.app.debug) {
  console.log('📋 App Configuration:', {
    environment: config.app.environment,
    supabaseConfigured: config.validation.isValidSupabaseConfig(),
    apiBaseUrl: config.api.baseUrl,
    featuresEnabled: Object.entries(config.features)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature),
  });
}
