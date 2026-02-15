import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import {
    Users, Plus, Search, Copy, ExternalLink, AlertTriangle,
    RotateCcw, X, Check
} from 'lucide-react';

const ClientsPage = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'archived' | 'all'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [newClient, setNewClient] = useState({ full_name: '', email: '' });
    const [createdToken, setCreatedToken] = useState(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalClients, setTotalClients] = useState(0);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            // Get clients with count and pagination
            let query = supabase
                .from('clients')
                .select(`
                    *,
                    checkins(id, submitted_at, risk_flags),
                    tasks!tasks_client_id_fkey(id, state)
                `, { count: 'exact' });

            if (statusFilter !== 'all') {
                query = query.eq('status', statusFilter);
            }

            if (searchTerm) {
                query = query.ilike('full_name', `%${searchTerm}%`);
            }

            // Apply pagination range (0-based index)
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query
                .order('created_at', { ascending: false })
                .range(from, to);

            const { data, count, error } = await query;
            if (error) throw error;

            setTotalClients(count || 0);

            // Process data to get useful aggregates
            const processed = (data || []).map(client => {
                const latestCheckin = client.checkins?.sort((a, b) =>
                    new Date(b.submitted_at) - new Date(a.submitted_at)
                )[0];
                const openTasks = client.tasks?.filter(t => t.state !== 'resolved').length || 0;
                const hasRiskFlags = latestCheckin?.risk_flags?.length > 0;

                return {
                    ...client,
                    latest_checkin_at: latestCheckin?.submitted_at,
                    open_tasks_count: openTasks,
                    has_risk: hasRiskFlags
                };
            });

            setClients(processed);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast.error('Failed to load clients');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, statusFilter, page, limit]);

    useEffect(() => {
        // Reset to page 1 when filters change
        setPage(1);
    }, [searchTerm, statusFilter]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleAddClient = async () => {
        if (!newClient.full_name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            const { data, error } = await supabase.rpc('create_client_and_token', {
                p_full_name: newClient.full_name.trim(),
                p_email: newClient.email?.trim() || null
            });

            if (error) throw error;

            if (data && data[0]) {
                setCreatedToken(data[0].raw_token);
                toast.success('Client created successfully');
                fetchClients();
            }
        } catch (error) {
            console.error('Error creating client:', error);
            toast.error('Failed to create client');
        }
    };

    const copyTokenLink = () => {
        const link = `${window.location.origin}/toolkit?token=${createdToken}`;
        navigator.clipboard.writeText(link);
        toast.success('Link copied to clipboard');
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingClient(null);
        setNewClient({ full_name: '', email: '' });
        setCreatedToken(null);
    };

    const handleEditClick = (e, client) => {
        e.stopPropagation();
        setEditingClient(client);
        setShowEditModal(true);
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
                .eq('id', editingClient.id);

            if (error) throw error;

            toast.success('Client updated successfully');
            closeModal();
            fetchClients();
        } catch (error) {
            console.error('Error updating client:', error);
            toast.error('Failed to update client');
        }
    };

    const handleArchiveClient = async (e, client) => {
        e.stopPropagation();
        const newStatus = client.status === 'active' ? 'archived' : 'active';
        const action = newStatus === 'archived' ? 'archive' : 'unarchive';

        if (!window.confirm(`Are you sure you want to ${action} ${client.full_name}?`)) return;

        try {
            const { error } = await supabase
                .from('clients')
                .update({ status: newStatus })
                .eq('id', client.id);

            if (error) throw error;

            toast.success(`Client ${action}d successfully`);
            fetchClients();
        } catch (error) {
            console.error('Error updating client status:', error);
            toast.error(`Failed to ${action} client`);
        }
    };

    const handleRegenerateToken = async (e, clientId) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure? The old link will stop working immediately.')) {
            return;
        }

        try {
            const { data, error } = await supabase.rpc('regenerate_client_token', {
                p_client_id: clientId
            });

            if (error) throw error;

            const link = `${window.location.origin}/toolkit?token=${data}`;
            navigator.clipboard.writeText(link);

            toast.success('Token regenerated! Link copied', {
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

    return (
        <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--brand-coral)]">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-h2 font-display text-[var(--text-primary)]">Clients</h1>
                        <p className="text-sm text-[var(--text-muted)]">Manage your client roster</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors shadow-md"
                >
                    <Plus size={18} />
                    Add Client
                </button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search clients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 text-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="all">All Status</option>
                </select>
            </div>

            <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)]">
                {/* Table header */}
                <div className="grid grid-cols-5 gap-4 p-4 border-b border-[var(--border)] text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                    <span>Name</span>
                    <span>Status</span>
                    <span>Last Check-in</span>
                    <span>Open Tasks</span>
                    <span>Actions</span>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-coral)] border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                        <Users size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No clients yet</p>
                        <p className="text-xs mt-1">Click "Add Client" to get started</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {clients.map(client => (
                            <div
                                key={client.id}
                                className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
                                onClick={() => navigate(`/coach/clients/${client.id}`)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[var(--text-primary)]">{client.full_name}</span>
                                    {client.has_risk && (
                                        <AlertTriangle size={14} className="text-red-500" />
                                    )}
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full w-fit ${client.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {client.status}
                                </span>
                                <span className="text-sm text-[var(--text-muted)]">
                                    {client.latest_checkin_at
                                        ? new Date(client.latest_checkin_at).toLocaleDateString()
                                        : 'Never'}
                                </span>
                                <span className="text-sm">
                                    {client.open_tasks_count > 0 ? (
                                        <span className="px-2 py-1 text-xs bg-[var(--brand-coral)]/10 text-[var(--brand-coral)] rounded-full">
                                            {client.open_tasks_count} open
                                        </span>
                                    ) : (
                                        <span className="text-[var(--text-muted)]">—</span>
                                    )}
                                </span>
                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={(e) => handleRegenerateToken(e, client.id)}
                                        className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
                                        title="Regenerate token"
                                    >
                                        <RotateCcw size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleEditClick(e, client)}
                                        className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
                                        title="Edit details"
                                    >
                                        <Users size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => handleArchiveClient(e, client)}
                                        className="p-2 text-[var(--text-muted)] hover:text-red-500 hover:bg-[var(--bg-card)] rounded-lg transition-colors"
                                        title={client.status === 'active' ? 'Archive' : 'Activate'}
                                    >
                                        {client.status === 'active' ? <X size={16} /> : <Check size={16} />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Footer */}
                {totalClients > limit && (
                    <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
                        <div className="text-sm text-[var(--text-muted)]">
                            Showing <span className="font-medium text-[var(--text-body)]">{(page - 1) * limit + 1}</span> to <span className="font-medium text-[var(--text-body)]">{Math.min(page * limit, totalClients)}</span> of <span className="font-medium text-[var(--text-body)]">{totalClients}</span> clients
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 text-sm font-medium text-[var(--text-body)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * limit >= totalClients}
                                className="px-3 py-1.5 text-sm font-medium text-[var(--text-body)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6 w-full max-w-md shadow-xl animate-fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-heading text-[var(--text-primary)]">
                                {createdToken ? 'Client Created!' : 'Add New Client'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {createdToken ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Check size={18} className="text-green-600" />
                                        <span className="font-medium text-green-800">Success!</span>
                                    </div>
                                    <p className="text-sm text-green-700">
                                        Copy this link and send it to your client. They can use it to submit check-ins.
                                    </p>
                                </div>

                                <div className="p-3 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)]">
                                    <p className="text-xs text-[var(--text-muted)] mb-1">Check-in Link:</p>
                                    <code className="text-xs break-all text-[var(--text-body)]">
                                        {window.location.origin}/toolkit?token={createdToken}
                                    </code>
                                </div>

                                <button
                                    onClick={copyTokenLink}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors"
                                >
                                    <Copy size={18} />
                                    Copy Link
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newClient.full_name}
                                        onChange={(e) => setNewClient(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                                        placeholder="Jane Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-body)] mb-1">
                                        Email (optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={newClient.email}
                                        onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-3 py-2 text-sm bg-[var(--bg-base)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-coral)]/20"
                                        placeholder="jane@example.com"
                                    />
                                </div>

                                <button
                                    onClick={handleAddClient}
                                    className="w-full px-4 py-3 text-sm font-medium text-white bg-[var(--brand-coral)] hover:bg-[var(--brand-deep)] rounded-lg transition-colors"
                                >
                                    Create Client
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Client Modal */}
            {showEditModal && editingClient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6 w-full max-w-md shadow-xl animate-fade-up">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-heading text-[var(--text-primary)]">Edit Client</h2>
                            <button
                                onClick={closeModal}
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
                                    onClick={closeModal}
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

export default ClientsPage;
