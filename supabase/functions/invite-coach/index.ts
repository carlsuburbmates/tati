// Supabase Edge Function: invite-coach
// Invites a new coach by sending them an email with a signup link.
// Only admins can invoke this function.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        // Create admin client (bypasses RLS)
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        // Get the calling user's JWT from the request
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            throw new Error("Missing authorization header");
        }

        // Verify the caller is an admin
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            throw new Error("Invalid token");
        }

        // Check if user is admin via profiles table
        const { data: profile, error: profileError } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError || profile?.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        // Parse request body
        const { email, full_name } = await req.json();

        if (!email) {
            throw new Error("Email is required");
        }

        // Invite user via Supabase Auth Admin API
        const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
            data: {
                full_name: full_name || "",
                role: "coach",
            },
            redirectTo: `${supabaseUrl.replace(".supabase.co", ".vercel.app")}/coach/setup`,
        });

        if (inviteError) {
            throw inviteError;
        }

        // Create a profile entry for the invited user
        if (inviteData.user) {
            await supabaseAdmin.from("profiles").upsert({
                id: inviteData.user.id,
                email: email,
                full_name: full_name || "",
                role: "coach",
                is_enabled: true,
            });
        }

        return new Response(
            JSON.stringify({ success: true, message: "Invitation sent", user_id: inviteData.user?.id }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 200
            }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400
            }
        );
    }
});
