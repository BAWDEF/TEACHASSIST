import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Initialize with empty values - will be set in the provider
const supabaseUrl = '';
const supabaseKey = '';

// Create a custom storage adapter for AsyncStorage
const AsyncStorageAdapter = {
  getItem: (key: string) => {
    return AsyncStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key);
  },
};

// Create supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: Platform.OS !== 'web' ? AsyncStorageAdapter : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
});

// Function to update supabase configuration
export const updateSupabaseConfig = (url: string, key: string) => {
  if (url && key) {
    // @ts-ignore - we're updating the client configuration
    supabase.supabaseUrl = url;
    // @ts-ignore - we're updating the client configuration
    supabase.supabaseKey = key;
  }
};