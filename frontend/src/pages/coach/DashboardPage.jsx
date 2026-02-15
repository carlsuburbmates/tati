import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, AlertCircle, Clock, ArrowRight, CheckCircle, Bell } from 'lucide-react';

const DashboardPage = () => {
    const [urgentTasks, setUrgentTasks] = useState([]);
    const [newSubmissions, setNewSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch tasks from Supabase
    const fetchTasks = async () => {
        setLoading(true);
        try {
            // Fetch urgent/overdue tasks
            const { data: urgent, error: urgentError } = await supabase
                .from('tasks')
                .select(`
                    *,
                    clients(id, full_name)
                `)
                .neq('state', 'resolved')
                .or('priority.eq.urgent,due_at.lt.now()')
                .order('due_at', { ascending: true })
                .limit(10);

            if (urgentError) throw urgentError;
            setUrgentTasks(urgent || []);

            // Fetch new submissions
            const { data: submissions, error: submissionsError } = await supabase
                .from('tasks')
                .select(`
                    *,
                    clients(id, full_name)
                `)
                .eq('type', 'review_checkin')
                .eq('state', 'new')
                .order('created_at', { ascending: false })
                .limit(10);

            if (submissionsError) throw submissionsError;
            setNewSubmissions(submissions || []);

        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark task as reviewed
    const markReviewed = async (taskId, checkinId) => {
        try {
            await supabase
                .from('tasks')
                .update({ state: 'resolved', resolved_at: new Date().toISOString() })
                .eq('id', taskId);

            if (checkinId) {
                await supabase
                    .from('checkins')
                    .update({ status: 'reviewed' })
                    .eq('id', checkinId);
            }

            fetchTasks();
        } catch (error) {
            console.error('Error marking reviewed:', error);
        }
    };

    // Mark for follow-up
    const markFollowUp = async (taskId) => {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            await supabase
                .from('tasks')
                .update({
                    state: 'follow_up_needed',
                    due_at: tomorrow.toISOString()
                })
                .eq('id', taskId);

            fetchTasks();
        } catch (error) {
            console.error('Error marking follow-up:', error);
        }
    };

    // Set up realtime subscription
    useEffect(() => {
        fetchTasks();

        // Subscribe to tasks changes
        const subscription = supabase
            .channel('tasks-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' },
                () => fetchTasks())
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const TaskCard = ({ task, onMarkReviewed, onFollowUp }) => {
        const clientLink = task.clients?.id
            ? `/coach/clients/${task.clients.id}${task.checkin_id ? `?checkin=${task.checkin_id}` : ''}`
            : '#';

        return (
            <div className="p-4 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)] hover:border-[var(--brand-coral)]/30 transition-all group">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {task.priority === 'urgent' && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">Urgent</span>
                            )}
                            <span className="text-xs text-[var(--text-muted)]">
                                {new Date(task.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 className="font-medium text-[var(--text-primary)]">{task.title}</h3>
                        <p className="text-sm text-[var(--text-muted)]">
                            {task.clients?.full_name || 'Unknown client'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                            to={clientLink}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--brand-coral)] hover:bg-[var(--bg-card)] rounded-lg transition-colors"
                            title="Open"
                        >
                            <ArrowRight size={16} />
                        </Link>
                        <button
                            onClick={() => onMarkReviewed(task.id, task.checkin_id)}
                            className="p-2 text-[var(--text-muted)] hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark reviewed"
                        >
                            <CheckCircle size={16} />
                        </button>
                        <button
                            onClick={() => onFollowUp(task.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Follow-up needed"
                        >
                            <Bell size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-20 bg-[var(--bg-elevated)] rounded-lg"></div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="h-64 bg-[var(--bg-elevated)] rounded-lg"></div>
                    <div className="h-64 bg-[var(--bg-elevated)] rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--brand-coral)]">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-h2 font-display text-[var(--text-primary)]">Today</h1>
                    <p className="text-sm text-[var(--text-muted)]">Your daily execution board</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Urgent/Overdue Lane */}
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={18} className="text-red-500" />
                            <h2 className="font-heading text-lg text-[var(--text-primary)]">Urgent / Overdue</h2>
                        </div>
                        {urgentTasks.length > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                                {urgentTasks.length}
                            </span>
                        )}
                    </div>

                    {urgentTasks.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-muted)]">
                            <p className="text-sm">No urgent items</p>
                            <p className="text-xs mt-1">Tasks will appear here when flagged</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {urgentTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onMarkReviewed={markReviewed}
                                    onFollowUp={markFollowUp}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* New Submissions Lane */}
                <div className="bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-[var(--accent-sage)]" />
                            <h2 className="font-heading text-lg text-[var(--text-primary)]">New Submissions</h2>
                        </div>
                        {newSubmissions.length > 0 && (
                            <span className="px-2 py-1 text-xs font-medium bg-[var(--accent-sage)]/20 text-[var(--accent-sage)] rounded-full">
                                {newSubmissions.length}
                            </span>
                        )}
                    </div>

                    {newSubmissions.length === 0 ? (
                        <div className="text-center py-8 text-[var(--text-muted)]">
                            <p className="text-sm">No new check-ins</p>
                            <p className="text-xs mt-1">Client submissions will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {newSubmissions.map(task => (
                                <TaskCard key={task.id} task={task} onMarkReviewed={markReviewed} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
