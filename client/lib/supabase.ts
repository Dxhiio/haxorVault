import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://runphepglrlpjsncfymn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1bnBoZXBnbHJscGpzbmNmeW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzE5ODAsImV4cCI6MjA3ODcwNzk4MH0.od3L0Hvzaolb8VrNkMAsRNDgm25ZDPx3o8r6G1EPhJ0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
