import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionValid, setSessionValid] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Check if we have a valid session (which the reset link should provide)
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                setSessionValid(!!session);
            } catch (error) {
                console.error('Session check error:', error);
            } finally {
                setChecking(false);
            }
        };

        // Also listen for the RECOVERY event
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setSessionValid(true);
            }
        });

        checkSession();

        return () => subscription.unsubscribe();
    }, []);

    const handleReset = async (e) => {
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

            if (error) throw error;

            toast.success('Password updated successfully! Redirecting...');

            setTimeout(() => {
                navigate('/coach/dashboard');
            }, 1500);

        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error(error.message || 'Failed to update password');
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
                            Invalid or Expired Link
                        </h1>
                        <p className="text-[var(--text-muted)] mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <button
                            onClick={() => navigate('/coach/login')}
                            className="px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl text-[var(--text-body)] hover:bg-[var(--bg-card)] transition-colors"
                        >
                            Back to Login
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
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--text-primary)]">
                            Reset Password
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-2">
                            Enter your new password below
                        </p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-[var(--brand-coral)] to-[var(--accent-sage)] text-white font-medium rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Update Password
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

export default ResetPasswordPage;
