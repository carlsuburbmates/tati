import React, { useState, useEffect } from 'react';
import { Clipboard, Printer, Save, Check, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

const CheckInModule = ({ checkinData, updateCheckin, saveCheckin, checkinHistory = [] }) => {
    // Fallback if data is missing during hydration
    const data = checkinData || { wins: '', struggles: '', adherence: '', steps: '', sessions: '', sleep: '', focus: ['', '', ''] };

    // Token detection for coach submission
    const [token, setToken] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check URL for token parameter
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');
        if (urlToken) {
            setToken(urlToken);
        }
    }, []);

    const getWeekRange = () => {
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const format = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${format(weekStart)} – ${format(weekEnd)}`;
    };

    const getWeekDates = () => {
        const now = new Date();
        const weekStart = new Date(now);
        // Start from Monday (1), not Sunday (0)
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        weekStart.setHours(0, 0, 0, 0);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        return {
            week_start: weekStart.toISOString().split('T')[0],
            week_end: weekEnd.toISOString().split('T')[0]
        };
    };

    const generateSummary = () => {
        const weekRange = getWeekRange();
        return `WEEKLY CHECK-IN\nWeek of: ${weekRange}\n\n` +
            `BIGGEST WINS:\n${data.wins}\n\n` +
            `STRUGGLES:\n${data.struggles}\n\n` +
            `STATS:\n` +
            `Adherence: ${data.adherence || 0}%\n` +
            `Training: ${data.sessions || 0} sessions\n` +
            `Steps avg: ${data.steps || 0}\n` +
            `Sleep avg: ${data.sleep || 0} hrs\n\n` +
            `NEXT WEEK FOCUS:\n${data.focus.filter(f => f).map(f => `- ${f}`).join('\n')}`;
    };

    const copyToClipboard = async () => {
        try {
            // Mobile-friendly clipboard API
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(generateSummary());
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = generateSummary();
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            toast.success('Check-in copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy to clipboard');
        }
    };

    const printPDF = () => {
        window.print();
    };

    const handleSaveCheckin = () => {
        if (!data.wins && !data.struggles && !data.adherence) {
            toast.error('Please fill in at least wins, struggles, or adherence before saving.');
            return;
        }
        saveCheckin();
        toast.success('Check-in saved!');
    };

    const handleSubmitToCoach = async () => {
        // Validate required fields
        if (!data.wins && !data.struggles) {
            toast.error('Please fill in wins or struggles before submitting.');
            return;
        }
        if (!data.adherence) {
            toast.error('Please enter your adherence percentage before submitting.');
            return;
        }

        setSubmitting(true);
        try {
            const { week_start, week_end } = getWeekDates();

            // Build payload from check-in data
            const payload = {
                wins: data.wins || '',
                struggles: data.struggles || '',
                adherence_percent: parseInt(data.adherence) || 0,
                training_sessions: parseInt(data.sessions) || 0,
                avg_steps: parseInt(data.steps) || 0,
                avg_sleep_hours: parseFloat(data.sleep) || 0,
                focus_areas: data.focus.filter(f => f),
                submitted_at: new Date().toISOString()
            };

            const { data: result, error } = await supabase.rpc('submit_checkin', {
                p_token: token,
                p_week_start: week_start,
                p_week_end: week_end,
                p_payload: payload
            });

            if (error) {
                console.error('Supabase RPC error:', error);
                if (error.message.includes('Invalid or expired token')) {
                    toast.error('Invalid or expired token. Please contact your coach for a new link.');
                } else {
                    toast.error('Failed to submit check-in. Please try again.');
                }
                return;
            }

            // Success! Mark as submitted locally
            setSubmitted(true);
            toast.success('Check-in submitted to your coach!');

            // Also save locally
            saveCheckin();

        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm p-6 md:p-8 animate-fade-up animate-delay-2 print:border-none print:shadow-none print:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-h3 font-display text-[var(--text-primary)]">Weekly Review</h2>
                    <p className="text-sm text-[var(--text-muted)]">{getWeekRange()}</p>
                </div>
                <div className="flex flex-wrap gap-2 print:hidden">
                    <button onClick={copyToClipboard} className="btn-ghost text-sm gap-2 border border-[var(--border)] hover:bg-[var(--bg-elevated)]">
                        <Clipboard size={16} /> <span className="hidden sm:inline">Copy</span>
                    </button>
                    <button onClick={printPDF} className="btn-ghost text-sm gap-2 border border-[var(--border)] hover:bg-[var(--bg-elevated)]">
                        <Printer size={16} /> <span className="hidden sm:inline">Print</span>
                    </button>
                    <button onClick={handleSaveCheckin} className="btn-primary text-sm gap-2">
                        <Save size={16} /> Save Check-in
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border)]">
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Biggest Wins</label>
                        <p className="text-xs text-[var(--text-muted)] mb-3">Celebrate small victories.</p>
                        <textarea
                            value={data.wins}
                            onChange={(e) => updateCheckin('wins', e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 min-h-[120px] resize-none text-[var(--text-body)] placeholder:text-[var(--text-muted)]/50"
                            placeholder="e.g. Hit protein target 6/7 days. Did new workout A."
                        />
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border)]">
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Struggles / Challenges</label>
                        <p className="text-xs text-[var(--text-muted)] mb-3">What got in the way?</p>
                        <textarea
                            value={data.struggles}
                            onChange={(e) => updateCheckin('struggles', e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 min-h-[120px] resize-none text-[var(--text-body)] placeholder:text-[var(--text-muted)]/50"
                            placeholder="e.g. Skipped Thursday workout. Ate poorly at dinner out."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Adherence</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">0-100%</p>
                        <div className="relative">
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                max="100"
                                value={data.adherence}
                                onChange={(e) => updateCheckin('adherence', e.target.value)}
                                placeholder="0"
                                className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all font-heading text-lg"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Training</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">Sessions completed</p>
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={data.sessions}
                            onChange={(e) => updateCheckin('sessions', e.target.value)}
                            placeholder="0"
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all font-heading text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Avg Steps</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">Check health app</p>
                        <input
                            type="number"
                            inputMode="numeric"
                            min="0"
                            value={data.steps}
                            onChange={(e) => updateCheckin('steps', e.target.value)}
                            placeholder="0"
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all font-heading text-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-1">Avg Sleep</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">Hours per night</p>
                        <input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            max="24"
                            step="0.1"
                            value={data.sleep}
                            onChange={(e) => updateCheckin('sleep', e.target.value)}
                            placeholder="0"
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all font-heading text-lg"
                        />
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-[var(--dashed-border, #E5E7EB)] border-dashed">
                    <label className="block text-label text-[var(--accent-sage)] mb-1">Next Week's Focus</label>
                    <p className="text-xs text-[var(--text-muted)] mb-4">Top 3 priorities.</p>
                    <div className="space-y-4">
                        {data.focus.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[var(--brand-coral)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {idx + 1}
                                </div>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                        const newFocus = [...data.focus];
                                        newFocus[idx] = e.target.value;
                                        updateCheckin('focus', newFocus);
                                    }}
                                    placeholder={idx === 0 ? "e.g. Pre-log meals" : idx === 1 ? "e.g. Sleep by 10pm" : `Priority ${idx + 1}`}
                                    className="w-full p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:outline-none transition-colors"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit to Coach button - only shown when token is present */}
                {token && (
                    <div className="p-6 rounded-xl bg-gradient-to-r from-[var(--brand-coral)]/5 to-[var(--accent-sage)]/5 border border-[var(--brand-coral)]/20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-heading text-[var(--text-primary)] mb-1">Ready to Submit?</h3>
                                <p className="text-sm text-[var(--text-muted)]">
                                    {submitted
                                        ? 'Your check-in has been submitted to your coach!'
                                        : 'Send your weekly check-in directly to your coach.'}
                                </p>
                            </div>
                            {submitted ? (
                                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                                    <Check size={18} />
                                    <span className="font-medium">Submitted</span>
                                </div>
                            ) : (
                                <button
                                    onClick={handleSubmitToCoach}
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors shadow-md disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                    {submitting ? 'Submitting...' : 'Submit to Coach'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Check-in History */}
                {checkinHistory.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-[var(--border)]">
                        <h3 className="text-h4 font-display text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <Check size={18} className="text-[var(--accent-sage)]" />
                            Saved Check-ins ({checkinHistory.length})
                        </h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {checkinHistory.slice().reverse().map((c) => (
                                <div key={c.id} className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-[var(--text-primary)]">
                                            {c.week_start} – {c.week_end}
                                        </span>
                                        <span className="text-xs text-[var(--text-muted)]">
                                            {c.adherence_percent}% adherence
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckInModule;

