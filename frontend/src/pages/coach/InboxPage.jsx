import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Inbox, Filter, CheckCircle, Clock, AlertTriangle, Calendar,
    CheckSquare, Search, ArrowRight, FileText, X, Bell
} from 'lucide-react';
import { toast } from 'sonner';

// Helper function for priority colors
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'urgent': return 'bg-red-100 text-red-700';
        case 'high': return 'bg-orange-100 text-orange-700';
        case 'medium': return 'bg-yellow-100 text-yellow-700';
        case 'low': return 'bg-blue-100 text-blue-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

// Helper function for number colors (e.g., adherence score)
const getNumberColor = (value) => {
    if (value >= 8) return 'text-green-600';
    if (value >= 5) return 'text-orange-600';
    return 'text-red-600';
};

const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== null;
};


const InboxPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [viewingTask, setViewingTask] = useState(null); // The task currently being viewed in modal

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalTasks, setTotalTasks] = useState(0);

    const filters = [
        { key: 'all', label: 'All Open' },
        { key: 'new', label: 'New' },
        { key: 'follow_up_needed', label: 'Follow-up' },
        { key: 'overdue', label: 'Overdue' },
    ];

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            // Assuming 'user' is available from a context or auth hook
            const { data: { user } } = await supabase.auth.getUser();

            let query = supabase
                .from('tasks')
                .select(`
                    *,
                    clients (id, full_name, status),
                    checkins (
                        id,
                        submitted_at,
                        risk_flags,
                        payload
                    )
                `, { count: 'exact' })
                .eq('coach_id', user.id)
                .neq('state', 'resolved');

            if (filter === 'new') {
                query = query.eq('state', 'new');
            } else if (filter === 'follow_up_needed') {
                query = query.eq('state', 'follow_up_needed');
            } else if (filter === 'overdue') {
                query = query.lt('due_at', new Date().toISOString());
            }

            // Apply pagination range (0-based index)
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            query = query
                .order('created_at', { ascending: false })
                .range(from, to);

            const { data, count, error } = await query;
            if (error) throw error;

            setTasks(data || []);
            setTotalTasks(count || 0);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [filter, page, limit]);

    useEffect(() => {
        setPage(1);
    }, [filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const toggleSelect = (taskId) => {
        setSelectedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const markResolved = async (taskIds) => {
        try {
            await supabase
                .from('tasks')
                .update({ state: 'resolved', resolved_at: new Date().toISOString() })
                .in('id', taskIds);

            setSelectedTasks([]);
            fetchTasks();
        } catch (error) {
            console.error('Error resolving tasks:', error);
        }
    };

    const setDueDate = async (taskIds, dueAt) => {
        try {
            await supabase
                .from('tasks')
                .update({ due_at: dueAt })
                .in('id', taskIds);

            fetchTasks();
        } catch (error) {
            console.error('Error setting due date:', error);
        }
    };

    const handleMarkReviewed = async (task) => {
        try {
            // 1. Update task state
            const { error: taskError } = await supabase
                .from('tasks')
                .update({ state: 'resolved', resolved_at: new Date().toISOString() })
                .eq('id', task.id);

            if (taskError) throw taskError;

            // 2. Update checkin status if it exists
            if (task.checkins && task.checkins.length > 0 && task.checkins[0].id) {
                const { error: checkinError } = await supabase
                    .from('checkins')
                    .update({ status: 'reviewed' })
                    .eq('id', task.checkins[0].id);

                if (checkinError) throw checkinError;
            }

            toast.success('Marked as reviewed');
            setViewingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error marking reviewed:', error);
            toast.error('Failed to update task');
        }
    };

    const handleFollowUp = async (task) => {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            const { error } = await supabase
                .from('tasks')
                .update({
                    state: 'follow_up_needed',
                    due_at: tomorrow.toISOString()
                })
                .eq('id', task.id);

            if (error) throw error;

            toast.success('Marked for keep-up');
            setViewingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error marking follow-up:', error);
            toast.error('Failed to update task');
        }
    };

    const TaskCard = ({ task }) => {
        const isSelected = selectedTasks.includes(task.id);
        const checkin = task.checkins && task.checkins.length > 0 ? task.checkins[0] : null;

        // Parse payload if it's a string (though Supabase returns object Usually)
        const payload = checkin?.payload;
        // Helper to safely get data regardless of structure variation
        const getPayloadValue = (key) => payload?.[key] || payload?.formData?.[key];

        const wins = getPayloadValue('wins');
        const adherence = getPayloadValue('adherence_score');

        return (
            <div className={`group bg-[var(--bg-card)] border rounded-[var(--radius-lg)] p-4 transition-all hover:border-[var(--brand-coral)]/30 ${task.state === 'new' ? 'border-l-4 border-l-[var(--brand-coral)]' : 'border-[var(--border)]'
                }`}>
                <div className="flex items-start gap-4">
                    <div className="pt-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(task.id); }}
                            className={`p-1 rounded transition-colors ${isSelected
                                ? 'text-[var(--brand-coral)]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            <CheckSquare size={20} className={isSelected ? 'fill-current opacity-20' : ''} />
                        </button>
                    </div>

                    <div className="flex-1 min-w-0" onClick={() => setViewingTask(task)}>
                        <div className="flex items-start justify-between mb-1">
                            <h3 className="font-medium text-[var(--text-primary)] truncate pr-2">
                                {task.title}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                        </div>

                        <p className="text-sm text-[var(--text-muted)] mb-3">
                            {task.clients?.full_name} • {task.type.replace('_', ' ')}
                        </p>

                        {/* Check-in high-level preview */}
                        {checkin && (
                            <div className="mb-3 p-3 bg-[var(--bg-base)] rounded-lg text-sm cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors">
                                <div className="flex items-center gap-4 mb-2 text-xs text-[var(--text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(checkin.submitted_at).toLocaleDateString()}
                                    </span>
                                    {adherence && (
                                        <span className={getNumberColor(adherence)}>
                                            {adherence}/10 Adherence
                                        </span>
                                    )}
                                </div>
                                {wins && (
                                    <p className="text-[var(--text-body)] line-clamp-2 italic">
                                        "{wins}"
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-3 mt-2">
                            {task.due_at && (
                                <span className={`text-xs flex items-center gap-1 ${isOverdue(task.due_at) ? 'text-red-500 font-medium' : 'text-[var(--text-muted)]'
                                    }`}>
                                    <Clock size={12} />
                                    {new Date(task.due_at).toLocaleDateString()}
                                </span>
                            )}

                            <div className="ml-auto flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleFollowUp(task); }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Follow-up needed"
                                >
                                    <Bell size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleMarkReviewed(task); }}
                                    className="p-1.5 text-[var(--text-muted)] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Mark Reviewed"
                                >
                                    <CheckCircle size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setViewingTask(task); }}
                                    className="text-xs font-medium text-[var(--brand-coral)] hover:underline flex items-center gap-1"
                                >
                                    <FileText size={12} />
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-up">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-sage)]">
                        <Inbox size={24} />
                    </div>
                    <div>
                        <h1 className="text-h2 font-display text-[var(--text-primary)]">Inbox</h1>
                        <p className="text-sm text-[var(--text-muted)]">Triage and manage your tasks</p>
                    </div>
                </div>

                {selectedTasks.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-muted)]">{selectedTasks.length} selected</span>
                        <button
                            onClick={() => markResolved(selectedTasks)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                            <CheckCircle size={16} />
                            Mark Resolved
                        </button>
                        <button
                            onClick={() => setDueDate(selectedTasks, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-[var(--bg-elevated)] text-[var(--text-body)] rounded-lg hover:bg-[var(--border)] transition-colors"
                        >
                            <Calendar size={16} />
                            Due Tomorrow
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)]">
                <div className="p-4 border-b border-[var(--border)]">
                    <div className="flex gap-2">
                        {filters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f.key
                                    ? 'bg-[var(--brand-coral)] text-white'
                                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--border)]'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-[var(--brand-coral)] border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="p-8 text-center text-[var(--text-muted)]">
                        <Inbox size={40} className="mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No tasks in inbox</p>
                        <p className="text-xs mt-1">Tasks will appear when clients submit check-ins</p>
                    </div>
                ) : (

                    <div className="space-y-3">
                        {tasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}

                {/* Pagination Footer */}
                {totalTasks > limit && (
                    <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
                        <div className="text-sm text-[var(--text-muted)]">
                            Showing <span className="font-medium text-[var(--text-body)]">{(page - 1) * limit + 1}</span> to <span className="font-medium text-[var(--text-body)]">{Math.min(page * limit, totalTasks)}</span> of <span className="font-medium text-[var(--text-body)]">{totalTasks}</span> tasks
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
                                disabled={page * limit >= totalTasks}
                                className="px-3 py-1.5 text-sm font-medium text-[var(--text-body)] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* Task Details Modal / Drawer */}
            {
                viewingTask && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50 animate-in fade-in duration-200">
                        <div className="w-full max-w-2xl h-full bg-[var(--bg-card)] border-l border-[var(--border)] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 p-6">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-xl font-heading text-[var(--text-primary)]">
                                        Check-in Review
                                    </h2>
                                    <p className="text-[var(--text-muted)]">
                                        {viewingTask.clients?.full_name} • {new Date(viewingTask.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setViewingTask(null)}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-base)]"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Check-in Content */}
                            {viewingTask.checkins?.payload ? (
                                <div className="space-y-6">
                                    {/* Risk Flags if any */}
                                    {viewingTask.checkins.risk_flags && viewingTask.checkins.risk_flags.length > 0 && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl">
                                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-medium mb-2">
                                                <AlertTriangle size={18} />
                                                Risk Flags Detected
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {viewingTask.checkins.risk_flags.map((flag, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-md">
                                                        {flag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Render JSON payload keys nicely */}
                                    <div className="space-y-4">
                                        {Object.entries(viewingTask.checkins.payload).map(([key, value]) => {
                                            if (typeof value === 'object' || key === 'risk_flags') return null; // Skip complex objects for simple view
                                            return (
                                                <div key={key} className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border)]">
                                                    <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
                                                        {key.replace(/_/g, ' ')}
                                                    </h4>
                                                    <p className="text-[var(--text-body)] whitespace-pre-wrap">
                                                        {value?.toString()}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Task Notes */}
                                    <div className="p-4 bg-[var(--bg-base)] rounded-xl border border-[var(--border)]">
                                        <h4 className="text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                                            Private Notes
                                        </h4>
                                        <textarea
                                            value={viewingTask.notes || ''}
                                            onChange={(e) => {
                                                const newNotes = e.target.value;
                                                setViewingTask(prev => ({ ...prev, notes: newNotes }));
                                            }}
                                            onBlur={async () => {
                                                try {
                                                    await supabase
                                                        .from('tasks')
                                                        .update({ notes: viewingTask.notes })
                                                        .eq('id', viewingTask.id);
                                                    toast.success('Notes saved');
                                                    // Optionally refresh tasks list effectively
                                                } catch (err) {
                                                    toast.error('Failed to save note');
                                                }
                                            }}
                                            placeholder="Add private notes about this task..."
                                            className="w-full h-24 p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-coral)] resize-none transition-colors"
                                        />
                                    </div>

                                </div>
                            ) : (
                                <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-base)] rounded-xl border border-[var(--border)] border-dashed">
                                    No check-in data attached to this task.
                                </div>
                            )}

                            {/* Actions Footer */}
                            <div className="sticky bottom-0 mt-8 pt-4 border-t border-[var(--border)] bg-[var(--bg-card)] flex justify-end gap-3 [mask-image:linear-gradient(to_bottom,transparent,black_20px)]">
                                <button
                                    onClick={() => setViewingTask(null)}
                                    className="px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-body)] font-medium hover:bg-[var(--bg-base)] transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => handleMarkReviewed(viewingTask)}
                                    className="px-6 py-2.5 rounded-xl bg-[var(--brand-coral)] text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-[var(--brand-coral)]/20"
                                >
                                    <CheckCircle size={18} />
                                    Mark as Reviewed
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default InboxPage;
