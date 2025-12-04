import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

// Use the same config as the other script
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
console.log("DEBUG: Connection String:", connectionString);

const DB_CONFIG = {
    connectionString,
    ssl: { rejectUnauthorized: false }
};

async function applyMigration() {
    const client = new Client(DB_CONFIG);
    
    try {
        await client.connect();
        console.log('Connected to database.');

        const migrationPath = path.join(__dirname, '../supabase/migrations/20251204000000_add_cert_details.sql');
        console.log(`Reading migration from: ${migrationPath}`);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log('Applying migration...');
        await client.query(sql);
        console.log('Migration applied successfully!');

    } catch (err) {
        console.error('Error applying migration:', err);
    } finally {
        await client.end();
    }
}

applyMigration();
