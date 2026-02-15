
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Usage: node tests/verif_patch_2_1.js
// Expects .env or process envs: SUPABASE_URL, SUPABASE_ANON_KEY, EMAIL, PASSWORD

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
    console.log("--- Starting Patch 2.1 Verification ---");

    // 1. Authenticate as Coach
    console.log("\n1. Login as Coach...");
    // NOTE: Requires a valid user. If not provided in env, script will fail here.
    // Ideally we'd use a test account, but we'll assume the user runs this with their creds
    // OR we can just check if we have a session.

    // For this generated script, we'll placeholder the login and ask user to fill it or check existing session if running in browser context (but this is node).
    // Failsafe: using a service role key if available for setup? No, we need to test RLS.
    // Let's assume the user has a test account credentials.
    const email = process.env.TEST_EMAIL || 'coach@example.com';
    const password = process.env.TEST_PASSWORD || 'password123';

    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (loginError) {
        console.warn("!! Login failed. Please set TEST_EMAIL and TEST_PASSWORD, or ensure user exists.");
        console.warn("Error:", loginError.message);
        // We can't proceed with RLS tasks without a user.
        return;
    }
    console.log("Logged in as:", session.user.email);
    const coachId = session.user.id;

    // 2. Create Client (RLS Insert Test)
    console.log("\n2. Creating Client (RPC)...");
    const { data: clientData, error: clientError } = await supabase.rpc('create_client_and_token', {
        p_full_name: 'Patch Test Client ' + Date.now()
    });

    if (clientError) {
        console.error("!! Client creation failed:", clientError);
        return;
    }
    const { id: clientId, raw_token: token } = clientData[0];
    console.log("Client created:", clientId);
    console.log("Token:", token);

    // 3. Submit Check-in as ANON (RPC Test)
    console.log("\n3. Submitting Check-in (Anon RPC)...");
    // Create specific anon client to be sure
    const supabaseAnon = createClient(supabaseUrl, supabaseKey);

    const { data: checkinRes, error: checkinError } = await supabaseAnon.rpc('submit_checkin', {
        p_token: token,
        p_week_start: '2026-02-02',
        p_week_end: '2026-02-08',
        p_payload: {
            wins: 'Tested Patch 2.1',
            adherence_percent: 65, // Should flag urgent
            sleep: 4.5 // Should flag high risk (handling 'sleep' key alias)
        }
    });

    if (checkinError) {
        console.error("!! Check-in failed:", checkinError);
        return;
    }
    console.log("Check-in submitted:", checkinRes);

    // 4. Verify Task Creation & RLS View
    console.log("\n4. Verifying Task via Coach...");
    const { data: tasks, error: taskFetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', clientId)
        .eq('state', 'new');

    if (taskFetchError) {
        console.error("!! Task fetch failed:", taskFetchError);
    } else if (tasks.length === 0) {
        console.error("!! No task found for new checkin!");
    } else {
        const task = tasks[0];
        console.log("Task found:", task.title);
        console.log("Priority:", task.priority); // Should be urgent or high (urgent wins)

        // 5. Update Task Notes (RLS Update Test)
        console.log("\n5. Updating Task Notes (RLS)...");
        const { error: updateError } = await supabase
            .from('tasks')
            .update({ notes: 'Verified via script' })
            .eq('id', task.id);

        if (updateError) console.error("!! Task update failed:", updateError);
        else console.log("Task notes updated successfully.");
    }

    // 6. Mark Check-in Reviewed (Checkin RLS Update Test)
    console.log("\n6. Marking Check-in Reviewed...");
    // Need checkin ID from task or response. Response had it.
    const checkinId = checkinRes.checkin_id;
    const { error: reviewError } = await supabase
        .from('checkins')
        .update({ status: 'reviewed' })
        .eq('id', checkinId);

    if (reviewError) console.error("!! Check-in review failed:", reviewError);
    else console.log("Check-in marked as reviewed.");

    console.log("\n--- Verification Complete ---");
}

runTest();
