import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import {
    ArrowLeft, User, Clock, AlertTriangle, FileText,
    CheckCircle, RotateCcw, Copy, Calendar, Users, X
} from 'lucide-react';

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [checkins, setCheckins] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCheckin, setSelectedCheckin] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const fetchClient = useCallback(async () => {
        try {
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single();

            if (clientError) throw clientError;
            setClient(clientData);

            // Fetch checkins
            const { data: checkinsData } = await supabase
                .from('checkins')
                .select('*')
                .eq('client_id', id)
                .order('submitted_at', { ascending: false });
            setCheckins(checkinsData || []);

            // Fetch tasks
            const { data: tasksData } = await supabase
                .from('tasks')
                .select('*')
                .eq('client_id', id)
                .order('created_at', { ascending: false });
            setTasks(tasksData || []);

        } catch (error) {
            console.error('Error fetching client:', error);
            toast.error('Failed to load client');
            navigate('/coach/clients');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchClient();
    }, [fetchClient]);

    // Handle deep linking for checkins
    const [searchParams] = useSearchParams();
    const checkinIdFromUrl = searchParams.get('checkin');

    useEffect(() => {
        if (checkinIdFromUrl && client?.checkins) {
            const checkin = client.checkins.find(c => c.id === checkinIdFromUrl);
            if (checkin) {
                setSelectedCheckin(checkin);
                // Clean up URL without reload
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }, [checkinIdFromUrl, client]);

    const regenerateToken = async () => {
        if (!window.confirm('Are you sure? The old link will stop working immediately.')) {
            return;
        }

        try {
            const { data, error } = await supabase.rpc('regenerate_client_token', {
                p_client_id: id
            });

            if (error) throw error;

            // Copy to clipboard automatically or show UI
            const link = `${window.location.origin}/toolkit?token=${data}`;
            navigator.clipboard.writeText(link);

            toast.success('Token regenerated! Link copied to clipboard', {
                duration: 5000,
                description: 'Share this new link with your client.',
                action: {
                    label: 'Copy Again',
                    onClick: () => navigator.clipboard.writeText(link)
                }
            });
        } catch (error) {
            console.error('Error regenerating token:', error);
            toast.error('Failed to regenerate token');
        }
    };

    const handleMarkReviewed = async (checkin) => {
        try {
            // 1. Update checkin status
            const { error: checkinError } = await supabase
                .from('checkins')
                .update({ status: 'reviewed' })
                .eq('id', checkin.id);

            if (checkinError) throw checkinError;

            // 2. Resolve associated task
            const { error: taskError } = await supabase
                .from('tasks')
                .update({ state: 'resolved' })
                .eq('client_id', id)
                .eq('checkin_id', checkin.id); // Assuming linking by checkin_id is possible or relying on inbox logic

            if (taskError) console.warn('Task update partial fail:', taskError);

            // 3. Update local state
            setCheckins(prev => prev.map(c =>
                c.id === checkin.id ? { ...c, status: 'reviewed' } : c
            ));

            // Allow task state update if optimal, but checkin status is primary here
            // Re-fetch tasks to ensure counts update correctly if a task was resolved
            const { data: updatedTasks } = await supabase
                .from('tasks')
                .select('*')
                .eq('client_id', id)
                .order('created_at', { ascending: false });
            setTasks(updatedTasks || []);

            toast.success('Check-in marked as reviewed');
        } catch (error) {
            console.error('Error marking reviewed:', error);
            toast.error('Failed to update status');
        }
    };

    const handleUpdateClient = async () => {
        try {
            const { error } = await supabase
                .from('clients')
                .update({
                    full_name: editingClient.full_name,
                    email: editingClient.email,
                    status: editingClient.status
                })
                .eq('id', client.id);

            if (error) throw error;

            toast.success('Client updated successfully');
            setShowEditModal(false);
            setClient({ ...client, ...editingClient });
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error('Failed to update client');
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-20 bg-[var(--bg-elevated)] rounded-lg"></div>
                <div className="h-48 bg-[var(--bg-elevated)] rounded-lg"></div>
            </div>
        );
    }

    if (!client) return null;

    const openTasks = tasks.filter(t => t.state !== 'resolved');
    const latestCheckin = checkins[0];

    return (
        <div className="animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <button
                        onClick={() => navigate('/coach/clients')}
                        className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
                    >
                        <ArrowLeft size={16} />
                        Back to Clients
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="font-heading text-3xl text-[var(--text-primary)]">
                            {client.full_name}
                        </h1>
                        <button
                            onClick={() => {
                                setEditingClient({
                                    full_name: client.full_name,
                                    email: client.email,
                                    status: client.status
                                });
                                setShowEditModal(true);
                            }}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] transition-colors"
                            title="Edit Client"
                        >
                            <Users size={20} />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${client.status === 'active'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border)]'
                        }`}>
                        {client.status.toUpperCase()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overview */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                        <h3 className="font-heading text-sm text-[var(--text-primary)] mb-4">Overview</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Member since</span>
                                <span className="text-sm text-[var(--text-body)]">
                                    {new Date(client.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Total check-ins</span>
                                <span className="text-sm text-[var(--text-body)]">{checkins.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Open tasks</span>
                                <span className={`text-sm ${openTasks.length > 0 ? 'text-[var(--brand-coral)]' : 'text-[var(--text-body)]'}`}>
                                    {openTasks.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[var(--text-muted)]">Last check-in</span>
                                <span className="text-sm text-[var(--text-body)]">
                                    {latestCheckin
                                        ? new Date(latestCheckin.submitted_at).toLocaleDateString()
                                        : 'Never'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                        <h3 className="font-heading text-sm text-[var(--text-primary)] mb-4">Actions</h3>
                        <div className="space-y-2">
                            <button
                                onClick={regenerateToken}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-body)] bg-[var(--bg-elevated)] hover:bg-[var(--border)] rounded-lg transition-colors"
                            >
                                <RotateCcw size={16} />
                                Regenerate Token
                            </button>
                        </div>
                    </div>

                    {/* Private Notes */}
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                        <h3 className="font-heading text-sm text-[var(--text-primary)] mb-4">Private Notes</h3>
                        <textarea
                            value={client.notes || ''}
                            onChange={(e) => {
                                setClient(prev => ({ ...prev, notes: e.target.value }));
                            }}
                            onBlur={async () => {
                                try {
                                    const { error } = await supabase
                                        .from('clients')
                                        .update({ notes: client.notes, updated_at: new Date().toISOString() })
                                        .eq('id', id);
                                    if (error) throw error;
                                    toast.success('Notes saved');
                                } catch (err) {
                                    toast.error('Failed to save notes');
                                }
                            }}
                            placeholder="Add private notes about this client..."
                            className="w-full h-32 p-3 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-sm text-[var(--text-body)] focus:outline-none focus:border-[var(--brand-coral)] resize-none transition-colors"
                        />
                        <p className="text-xs text-[var(--text-muted)] mt-2">
                            Auto-saves when you click outside.
                        </p>
                    </div>
                </div>

                {/* Check-ins */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)]">
                        <div className="p-4 border-b border-[var(--border)]">
                            <h3 className="font-heading text-sm text-[var(--text-primary)]">Check-in History</h3>
                        </div>

                        {checkins.length === 0 ? (
                            <div className="p-8 text-center text-[var(--text-muted)]">
                                <FileText size={32} className="mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No check-ins yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border)]">
                                {checkins.map(checkin => (
                                    <div
                                        key={checkin.id}
                                        className="p-4 hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                                        onClick={() => setSelectedCheckin(selectedCheckin === checkin.id ? null : checkin.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-[var(--text-muted)]" />
                                                <span className="text-sm font-medium text-[var(--text-primary)]">
                                                    Week of {new Date(checkin.week_start).toLocaleDateString()}
                                                </span>
                                                {checkin.risk_flags?.length > 0 && (
                                                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                                                        <AlertTriangle size={12} />
                                                        Risk flagged
                                                    </span>
                                                )}
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${checkin.status === 'reviewed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {checkin.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-[var(--text-muted)]">
                                            Submitted {new Date(checkin.submitted_at).toLocaleString()}
                                        </p>

                                        {selectedCheckin === checkin.id && checkin.payload && (
                                            <div className="mt-4 p-4 bg-[var(--bg-base)] rounded-lg border border-[var(--border)]">
                                                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase mb-2">Check-in Data</h4>
                                                <pre className="text-xs text-[var(--text-body)] whitespace-pre-wrap overflow-auto max-h-64 mb-4">
                                                    {JSON.stringify(checkin.payload, null, 2)}
                                                </pre>

                                                {checkin.status !== 'reviewed' && (
                                                    <div className="flex justify-end pt-2 border-t border-[var(--border)]">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkReviewed(checkin);
                                                            }}
                                                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors shadow-sm"
                                                        >
                                                            <CheckCircle size={14} />
                                                            Mark as Reviewed
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Edit Client Modal */}
            {showEditModal && editingClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6 w-full max-w-md shadow-xl animate-fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-heading text-[var(--text-primary)]">Edit Client</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={editingClient.full_name}
                                    onChange={(e) => setEditingClient(prev => ({ ...prev, full_name: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editingClient.email || ''}
                                    onChange={(e) => setEditingClient(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                                    Status
                                </label>
                                <select
                                    value={editingClient.status}
                                    onChange={(e) => setEditingClient(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-[var(--text-body)] bg-[var(--bg-elevated)] hover:bg-[var(--border)] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateClient}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetailPage;
