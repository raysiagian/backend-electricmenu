import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
console.log(process.env.SUPABASE_URL);
console.log(process.env.SUPABASE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY; // Menyamakan dengan variabel di .env kamu
const supabaseRole = process.env.SUPABASE_SERVICE_ROLE


// Validasi untuk memastikan file .env terbaca dengan benar
if (!supabaseUrl || !supabaseKey) {
  throw new Error("unknow supabase url and supabase service role");
}

const supabase = createClient(supabaseUrl, supabaseRole);

export default supabase;