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

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFlow() {
    console.log('Starting Coach Panel Backend Flow Test (v3)...');

    const timestamp = Date.now();
    // Try a very simple email format
    const email = `coach${timestamp}@test.com`;
    const password = 'testpassword123';

    console.log(`1. Signing up test coach: ${email}`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (authError) {
        console.error('   Sign up error:', authError.message);
        // Try sign in just in case
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (signInError) {
            console.error('FAIL: Could not authenticate (Sign In failed):', signInError.message);
            return;
        }
        console.log('   Sign In successful (User existed).');
    } else {
        if (!authData.session) {
            // Check if user is created but session is null (email confirm)
            if (authData.user) {
                console.error('FAIL: User created but email confirmation required.');
                console.log('   User ID:', authData.user.id);
            } else {
                console.error('FAIL: No user or session returned.');
            }
            return;
        }
        console.log('   Sign Up successful. Session active.');
    }

    // Resume flow if authenticated...
}

testFlow();
