
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars manually since we are running a script
// Note: Vite loads .env.local automatically, but for this script we use dotenv
// However, dotenv usually looks for .env. We need to point it to .env.local if possible
// or just manually parse it if dotenv isn't installed.
// Assuming dotenv might not be in package.json devDependencies? 
// package.json showed: @supabase/supabase-js, jspdf, react, react-dom, @types/node, @vitejs/plugin-react, typescript, vite.
// It does NOT have dotenv.

// So I will read the file manually to avoid installing dependencies.
import fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env.local');
let supabaseUrl = '';
let supabaseKey = '';

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
        const [key, val] = line.split('=');
        if (key?.trim() === 'VITE_SUPABASE_URL') supabaseUrl = val?.trim();
        if (key?.trim() === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val?.trim();
    }
}

if (!supabaseUrl || !supabaseKey) {
    console.error('Could not find Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing Supabase connection...');
    console.log(`URL: ${supabaseUrl}`);

    const { data, error } = await supabase.from('products').select('*').limit(1);

    if (error) {
        console.error('Connection failed:', error);
    } else {
        console.log('Connection successful!');
        console.log('Products found:', data?.length);
        if (data?.length > 0) {
            console.log('Sample product:', data[0].name);
        } else {
            console.log('No products found in table.');
        }
    }
}

testConnection();
