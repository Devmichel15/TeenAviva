// Environment variables for TeenAviva
// EXPO_PUBLIC_* variables are available via process.env in Expo SDK 49+
// For local dev, create a .env file in the project root

export const ENV = {
  HF_TOKEN: process.env.EXPO_PUBLIC_HF_TOKEN || '',
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
};
