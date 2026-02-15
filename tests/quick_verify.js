const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const url = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
    console.log('MISSING ENV VARS - url:', !!url, 'key:', !!key);
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    console.log('--- Verifying Remote Schema ---');

    // Test 1: Tables exist
    const { error: e1 } = await supabase.from('clients').select('id').limit(1);
    console.log('clients table:', e1 ? 'FAIL - ' + e1.message : 'PASS');

    const { error: e2 } = await supabase.from('tasks').select('id').limit(1);
    console.log('tasks table:', e2 ? 'FAIL - ' + e2.message : 'PASS');

    const { error: e3 } = await supabase.from('checkins').select('id').limit(1);
    console.log('checkins table:', e3 ? 'FAIL - ' + e3.message : 'PASS');

    // Test 2: RPC exists (will fail with token error, not "function does not exist")
    const { error: e4 } = await supabase.rpc('submit_checkin', {
        p_token: 'test',
        p_week_start: '2026-02-01',
        p_week_end: '2026-02-07',
        p_payload: {}
    });
    const rpcExists = !e4 || !e4.message.includes('does not exist');
    console.log('submit_checkin RPC:', rpcExists ? 'PASS (exists)' : 'FAIL - ' + e4.message);
    if (e4 && rpcExists) {
        console.log('  (Expected error: ' + e4.message + ')');
    }

    console.log('--- Verification Complete ---');
}

test();
