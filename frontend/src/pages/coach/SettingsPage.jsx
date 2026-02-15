import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { Settings, Save, Bell, Shield, Calendar, Check, Users, UserPlus, Copy, UserX, UserCheck, Loader2, Mail } from 'lucide-react';
import useUserProfile from '../../hooks/useUserProfile';

const SettingsPage = () => {
    const { isAdmin, loading: profileLoading } = useUserProfile();
    const [settings, setSettings] = useState({
        default_checkin_day: 0,
        default_due_hour: 18,
        default_overdue_after_hours: 48,
        risk_keywords: ['pain', 'injury', 'hurt', 'faint', 'dizzy', 'purge', 'self-harm']
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Team management state
    const [coaches, setCoaches] = useState([]);
    const [loadingCoaches, setLoadingCoaches] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('coach');
    const [inviting, setInviting] = useState(false);
    const [lastInviteLink, setLastInviteLink] = useState('');

    const dayOptions = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
    ];

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data, error } = await supabase
                    .from('settings')
                    .select('*')
                    .eq('coach_id', user.id)
                    .maybeSingle();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setSettings({
                        default_checkin_day: data.default_checkin_day ?? 0,
                        default_due_hour: data.default_due_hour ?? 18,
                        default_overdue_after_hours: data.default_overdue_after_hours ?? 48,
                        risk_keywords: data.risk_keywords || ['pain', 'injury', 'hurt', 'faint', 'dizzy', 'purge', 'self-harm']
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    // Fetch coaches list (admin only)
    useEffect(() => {
        if (!isAdmin) return;

        const fetchCoaches = async () => {
            setLoadingCoaches(true);
            try {
                // Use RPC to get coaches with emails
                const { data, error } = await supabase.rpc('list_coaches');

                if (error) throw error;

                setCoaches(data || []);
            } catch (error) {
                console.error('Error fetching coaches:', error);
            } finally {
                setLoadingCoaches(false);
            }
        };

        fetchCoaches();
    }, [isAdmin]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { error } = await supabase
                .from('settings')
                .upsert({
                    coach_id: user.id,
                    default_checkin_day: settings.default_checkin_day,
                    default_due_hour: settings.default_due_hour,
                    default_overdue_after_hours: settings.default_overdue_after_hours,
                    risk_keywords: settings.risk_keywords,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'coach_id' });

            if (error) throw error;
            toast.success('Settings saved');
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleKeywordsChange = (value) => {
        const keywords = value.split(',').map(k => k.trim()).filter(Boolean);
        setSettings(prev => ({ ...prev, risk_keywords: keywords }));
    };

    const handleInviteCoach = async (e) => {
        e.preventDefault();
        if (!inviteEmail) return;

        setInviting(true);
        setLastInviteLink('');

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const response = await fetch(
                `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/invite-coach`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({ email: inviteEmail, role: inviteRole })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to send invite');
            }

            // generateLink method always returns action_link, email method may not
            if (result.action_link) {
                setLastInviteLink(result.action_link);
                if (result.method === 'link') {
                    toast.success(`Invite link generated for ${inviteEmail}! Share the link below.`);
                } else {
                    toast.success(`Invite sent to ${inviteEmail}! Copy link below as backup.`);
                }
            } else {
                toast.success(`Invite email sent to ${inviteEmail}`);
            }

            setInviteEmail('');

            // Refresh coaches list using RPC
            const { data } = await supabase.rpc('list_coaches');
            setCoaches(data || []);

        } catch (error) {
            console.error('Error inviting coach:', error);
            toast.error(error.message || 'Failed to send invite');
        } finally {
            setInviting(false);
        }
    };

    const handleToggleCoach = async (coachId, currentEnabled) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_enabled: !currentEnabled })
                .eq('id', coachId);

            if (error) throw error;

            setCoaches(prev => prev.map(c =>
                c.id === coachId ? { ...c, is_enabled: !currentEnabled } : c
            ));

            toast.success(currentEnabled ? 'Coach disabled' : 'Coach enabled');
        } catch (error) {
            console.error('Error toggling coach:', error);
            toast.error('Failed to update coach status');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard');
    };

    if (loading || profileLoading) {
        return (
            <div className="animate-pulse space-y-6 max-w-2xl">
                <div className="h-16 bg-[var(--bg-elevated)] rounded-lg"></div>
                <div className="h-48 bg-[var(--bg-elevated)] rounded-lg"></div>
                <div className="h-48 bg-[var(--bg-elevated)] rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up max-w-2xl">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-sage)]">
                    <Settings size={24} />
                </div>
                <div>
                    <h1 className="text-h2 font-display text-[var(--text-primary)]">Settings</h1>
                    <p className="text-sm text-[var(--text-muted)]">Configure your coaching preferences</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Team Management (Admin Only) */}
                {isAdmin && (
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={18} className="text-[var(--brand-coral)]" />
                            <h2 className="font-heading text-lg text-[var(--text-primary)]">Team (Coaches)</h2>
                        </div>

                        {/* Invite Form */}
                        <form onSubmit={handleInviteCoach} className="mb-6">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        placeholder="coach@example.com"
                                        disabled={inviting}
                                        className="w-full pl-10 pr-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20 disabled:opacity-50"
                                    />
                                </div>
                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    disabled={inviting}
                                    className="px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20 disabled:opacity-50"
                                >
                                    <option value="coach">Coach</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={inviting || !inviteEmail}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {inviting ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <UserPlus size={16} />
                                    )}
                                    Invite
                                </button>
                            </div>
                        </form>

                        {/* Last Invite Link */}
                        {lastInviteLink && (
                            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 font-medium mb-2">Invite link generated:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={lastInviteLink}
                                        readOnly
                                        className="flex-1 px-3 py-2 text-xs bg-white border border-green-300 rounded-lg text-green-800"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(lastInviteLink)}
                                        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                                    >
                                        <Copy size={14} />
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Coaches List */}
                        <div className="space-y-2">
                            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Team Members</p>
                            {loadingCoaches ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="animate-spin text-[var(--text-muted)]" size={20} />
                                </div>
                            ) : coaches.length === 0 ? (
                                <p className="text-sm text-[var(--text-muted)] py-4 text-center">No team members yet</p>
                            ) : (
                                coaches.map((coach) => (
                                    <div
                                        key={coach.id}
                                        className="flex items-center justify-between p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${coach.is_enabled ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-[var(--text-body)]">
                                                    {coach.email}
                                                </p>
                                                <p className="text-xs text-[var(--text-muted)]">
                                                    {coach.role} · {coach.is_enabled ? 'Active' : 'Disabled'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${coach.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {coach.role}
                                            </span>
                                            {coach.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleToggleCoach(coach.id, coach.is_enabled)}
                                                    className={`p-1.5 rounded-lg transition-colors ${coach.is_enabled
                                                        ? 'text-red-500 hover:bg-red-50'
                                                        : 'text-green-500 hover:bg-green-50'
                                                        }`}
                                                    title={coach.is_enabled ? 'Disable coach' : 'Enable coach'}
                                                >
                                                    {coach.is_enabled ? <UserX size={16} /> : <UserCheck size={16} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Check-in Schedule */}
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar size={18} className="text-[var(--brand-coral)]" />
                        <h2 className="font-heading text-lg text-[var(--text-primary)]">Check-in Schedule</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-1">Default Check-in Day</label>
                            <select
                                value={settings.default_checkin_day}
                                onChange={(e) => setSettings(prev => ({ ...prev, default_checkin_day: parseInt(e.target.value) }))}
                                className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                            >
                                {dayOptions.map(day => (
                                    <option key={day.value} value={day.value}>{day.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-body)] mb-1">Due Hour (0-23)</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={settings.default_due_hour}
                                onChange={(e) => setSettings(prev => ({ ...prev, default_due_hour: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Risk Detection */}
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={18} className="text-red-500" />
                        <h2 className="font-heading text-lg text-[var(--text-primary)]">Risk Detection</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-body)] mb-1">Risk Keywords</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">Check-ins containing these words will be flagged as urgent (comma-separated)</p>
                        <input
                            type="text"
                            value={settings.risk_keywords.join(', ')}
                            onChange={(e) => handleKeywordsChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                        />
                        <div className="flex flex-wrap gap-1 mt-2">
                            {settings.risk_keywords.map((keyword, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                    {keyword}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell size={18} className="text-[var(--accent-sage)]" />
                        <h2 className="font-heading text-lg text-[var(--text-primary)]">Overdue Thresholds</h2>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-body)] mb-1">Overdue After (hours)</label>
                        <p className="text-xs text-[var(--text-muted)] mb-2">Tasks will be marked overdue after this many hours</p>
                        <input
                            type="number"
                            min="1"
                            max="168"
                            value={settings.default_overdue_after_hours}
                            onChange={(e) => setSettings(prev => ({ ...prev, default_overdue_after_hours: parseInt(e.target.value) || 48 }))}
                            className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors shadow-md disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Save size={18} />
                    )}
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;
