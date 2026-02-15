import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Lock, Check, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const AcceptInvitePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [sessionValid, setSessionValid] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                // The invite link sets up a session automatically
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setSessionValid(true);
                    setUserEmail(session.user.email || '');
                } else {
                    setSessionValid(false);
                }
            } catch (error) {
                console.error('Session check error:', error);
                setSessionValid(false);
            } finally {
                setChecking(false);
            }
        };

        checkSession();

        // Listen for auth changes (invite link may trigger this)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                setSessionValid(true);
                setUserEmail(session.user.email || '');
                setChecking(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                toast.error(error.message || 'Failed to set password');
                return;
            }

            toast.success('Password set successfully! Welcome to the team.');
            navigate('/coach/dashboard');
        } catch (err) {
            console.error('Set password error:', err);
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-elevated)]">
                <Loader2 className="animate-spin text-[var(--brand-coral)]" size={40} />
            </div>
        );
    }

    if (!sessionValid) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-elevated)] py-20 px-4">
                <div className="w-full max-w-md">
                    <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border)] p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--text-primary)] mb-3">
                            Invite Link Expired
                        </h1>
                        <p className="text-[var(--text-muted)] mb-6">
                            This invitation link has expired or is invalid. Please contact your administrator for a new invite.
                        </p>
                        <button
                            onClick={() => navigate('/coach/login')}
                            className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[var(--text-body)] hover:bg-[var(--bg-card)] transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-elevated)] py-20 px-4">
            <div className="w-full max-w-md">
                <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border)] p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--brand-coral)] to-[var(--accent-sage)] flex items-center justify-center">
                            <Check className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--text-primary)]">
                            Welcome to the Team!
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-2">
                            Set your password to complete your account setup
                        </p>
                        {userEmail && (
                            <p className="text-sm text-[var(--brand-coral)] mt-1">
                                {userEmail}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSetPassword} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-[var(--text-body)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)] focus:border-transparent transition-all disabled:opacity-50"
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-[var(--text-body)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)] focus:border-transparent transition-all disabled:opacity-50"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-[var(--brand-coral)] to-[var(--accent-sage)] text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Set Password & Continue
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AcceptInvitePage;
