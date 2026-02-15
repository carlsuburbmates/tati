import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, ShieldX } from 'lucide-react';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Check current session and profile
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session) {
                    // Check if user is enabled
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('is_enabled')
                        .eq('id', session.user.id)
                        .single();

                    if (profile?.is_enabled === false) {
                        setIsEnabled(false);
                        setAuthenticated(true);
                    } else {
                        setIsEnabled(true);
                        setAuthenticated(true);
                    }
                } else {
                    navigate('/coach/login', { replace: true });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                if (mounted) {
                    navigate('/coach/login', { replace: true });
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        checkAuth();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!mounted) return;

                if (event === 'SIGNED_OUT' || !session) {
                    setAuthenticated(false);
                    navigate('/coach/login', { replace: true });
                } else if (event === 'SIGNED_IN' && session) {
                    checkAuth(); // Re-check including profile
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [navigate, location.pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
                <Loader2 className="animate-spin text-[var(--brand-coral)]" size={40} />
            </div>
        );
    }

    // Show disabled account message
    if (authenticated && !isEnabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                        <ShieldX className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-display text-[var(--text-primary)] mb-3">
                        Account Disabled
                    </h1>
                    <p className="text-[var(--text-muted)] mb-6">
                        Your coach account has been disabled. Please contact an administrator for assistance.
                    </p>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            navigate('/coach/login');
                        }}
                        className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[var(--text-body)] hover:bg-[var(--bg-card)] transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return authenticated ? <>{children}</> : null;
};

export default AuthGuard;
