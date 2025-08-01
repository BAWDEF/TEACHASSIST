// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vmsvlwjxlgqkgxzivabp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtc3Zsd2p4bGdxa2d4eml2YWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjQ3NDksImV4cCI6MjA2OTIwMDc0OX0.LjqO6e4IMSknvsw0wDwq2zMLAyY3q82qkW9COr68K58'

// THIS IS THE IMPORTANT BIT: Add 'export' here!
export const supabase = createClient(supabaseUrl, supabaseKey)