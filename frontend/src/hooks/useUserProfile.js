import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to fetch and cache the current user's profile (role, is_enabled)
 */
export const useUserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    if (mounted) {
                        setProfile(null);
                        setLoading(false);
                    }
                    return;
                }

                const { data, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, role, is_enabled, created_at')
                    .eq('id', user.id)
                    .single();

                if (mounted) {
                    if (profileError) {
                        // Profile doesn't exist - create one with default role
                        if (profileError.code === 'PGRST116') {
                            setProfile({ id: user.id, role: 'coach', is_enabled: true });
                        } else {
                            setError(profileError);
                        }
                    } else {
                        setProfile(data);
                    }
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setError(err);
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
            fetchProfile();
        });

        return () => {
            mounted = false;
            subscription?.unsubscribe();
        };
    }, []);

    const isAdmin = profile?.role === 'admin';
    const isEnabled = profile?.is_enabled !== false;

    return { profile, loading, error, isAdmin, isEnabled };
};

export default useUserProfile;
