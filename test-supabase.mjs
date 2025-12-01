import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

// ... resto igual

// OJO: aquí NO existe import.meta.env, así que leemos de process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en process.env",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const main = async () => {
  // prueba básica: leer tabla machines
  const { data, error } = await supabase.from("machines").select("*");

  if (error) {
    console.error("Error consultando machines:", error);
  } else {
    console.log("Conexión OK, machines:", data);
  }
};

main();
