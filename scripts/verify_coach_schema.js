const fs = require('fs');
const path = require('path');

// Add frontend node_modules to path
module.paths.push(path.join(__dirname, '../frontend/node_modules'));

const { createClient } = require('@supabase/supabase-js');

// Manually parse .env file from frontend directory
const envPath = path.join(__dirname, '../frontend/.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Using Supabase URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables. Check .env file.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySchema() {
    console.log('Verifying Coach Panel Schema...');

    // Check tables
    const tables = ['clients', 'checkins', 'tasks'];
    let allPass = true;
    for (const table of tables) {
        const { error } = await supabase.from(table).select('id').limit(0);
        if (error) {
            console.error(`FAIL: Table '${table}' access error:`, error.message);
            allPass = false;
        } else {
            console.log(`PASS: Table '${table}' exists.`);
        }
    }

    // Check RPC
    console.log('Verifying RPC create_client_and_token...');
    const { error: rpcError } = await supabase.rpc('create_client_and_token', {
        p_full_name: 'Test Client',
        p_email: 'test@example.com'
    });

    // We expect "permission denied" or similar if ACLs are working but function exists.
    // "OID not found" or "function not found" means it's missing.
    // The error message from PostgREST/Supabase for missing function is usually:
    // "Could not find the function public.function_name in the schema cache"

    if (rpcError) {
        if (rpcError.message && rpcError.message.includes('Could not find the function')) {
            console.error('FAIL: RPC create_client_and_token not found.');
            allPass = false;
        } else {
            // Access denied is good (means it exists but we are anon)
            console.log(`PASS: RPC create_client_and_token exists (Access check: ${rpcError.message})`);
        }
    } else {
        console.log('PASS: RPC create_client_and_token executed successfully.');
    }

    if (!allPass) {
        console.error('Schema verification failed. Migrations may not be applied.');
        process.exit(1);
    } else {
        console.log('Schema verification passed.');
    }
}

verifySchema();
