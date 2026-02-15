import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                if (error.status === 429) {
                    toast.error('Too many attempts. Please wait a minute and try again.');
                } else {
                    toast.error(error.message || 'Sign in failed');
                }
                return;
            }

            if (data?.session) {
                toast.success('Welcome back!');
                navigate('/coach/dashboard');
            }
        } catch (err) {
            console.error('Auth error:', err);
            toast.error('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--bg-base)] to-[var(--bg-elevated)] py-20 px-4">
            <div className="w-full max-w-md">
                <div className="bg-[var(--bg-card)] rounded-2xl shadow-xl border border-[var(--border)] p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--brand-coral)] to-[var(--accent-sage)] flex items-center justify-center">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-display text-[var(--text-primary)]">
                            Coach Access
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-2">
                            Sign in to your dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="w-full pl-12 pr-4 py-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-xl text-[var(--text-body)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)] focus:border-transparent transition-all disabled:opacity-50"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-2">
                                Password
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
                                    placeholder="••••••••"
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
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={async () => {
                                    if (!email) {
                                        toast.error('Please enter your email first');
                                        return;
                                    }
                                    try {
                                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                            redirectTo: `${window.location.origin}/coach/reset-password`,
                                        });
                                        if (error) throw error;
                                        toast.success('Password reset link sent to your email');
                                    } catch (err) {
                                        toast.error(err.message || 'Failed to send reset link');
                                    }
                                }}
                                className="text-sm text-[var(--brand-coral)] hover:text-[var(--brand-deep)] transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default LoginPage;
