import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    ssl: {
        rejectUnauthorized: false // Wajib ditambahkan agar koneksi ke cloud (Supabase) tidak di-block SSL oleh Node.js
    }
});

export default pool;
