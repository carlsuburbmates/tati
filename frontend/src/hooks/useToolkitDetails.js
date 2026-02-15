import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tati_toolkit_v1';
const CURRENT_SCHEMA_VERSION = 2;

const INITIAL_STATE = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    goals: {
        title: '',
        metricType: 'adherence',
        baseline: '',
        target: '',
        deadline: '',
        focusActions: ['', '', ''],
        progress: 0,
        milestones: []
    },
    habits: {
        list: [
            'Protein target hit',
            'Steps goal hit',
            'Workout completed',
            'Sleep 7+ hours',
            'Balanced plate (2 meals)'
        ],
        tracking: {}
    },
    checkins: [],
    currentCheckin: {
        wins: '',
        struggles: '',
        adherence: '',
        steps: '',
        sessions: '',
        sleep: '',
        focus: ['', '', '']
    }
};

// Migration function for legacy data
const migrateData = (data) => {
    if (!data) return null;

    let migrated = { ...data };

    // Migrate from v1 (no schemaVersion) to v2
    if (!migrated.schemaVersion) {
        migrated.schemaVersion = CURRENT_SCHEMA_VERSION;

        // Move checkins.currentCheckin to top-level currentCheckin
        if (migrated.checkins?.currentCheckin) {
            migrated.currentCheckin = {
                wins: migrated.checkins.currentCheckin.wins || '',
                struggles: migrated.checkins.currentCheckin.struggles || '',
                adherence: migrated.checkins.currentCheckin.adherence || '',
                steps: migrated.checkins.currentCheckin.steps || '',
                sessions: '',
                sleep: '',
                focus: migrated.checkins.currentCheckin.focus || ['', '', '']
            };
        } else {
            migrated.currentCheckin = INITIAL_STATE.currentCheckin;
        }

        // Transform checkins to array format
        if (migrated.checkins?.history && Array.isArray(migrated.checkins.history)) {
            migrated.checkins = migrated.checkins.history.map((h, idx) => ({
                id: `legacy-${idx}`,
                week_start: h.date || '',
                week_end: h.date || '',
                wins: h.wins || '',
                struggles: h.struggles || '',
                adherence_percent: h.stats?.adherence || '',
                sessions_completed: '',
                avg_steps: h.stats?.steps || '',
                avg_sleep: '',
                next_focus_1: '',
                next_focus_2: '',
                next_focus_3: '',
                created_at: h.date || new Date().toISOString()
            }));
        } else {
            migrated.checkins = [];
        }
    }

    // Ensure currentCheckin has new fields
    if (!migrated.currentCheckin) {
        migrated.currentCheckin = INITIAL_STATE.currentCheckin;
    } else {
        migrated.currentCheckin = {
            ...INITIAL_STATE.currentCheckin,
            ...migrated.currentCheckin,
            sessions: migrated.currentCheckin.sessions || '',
            sleep: migrated.currentCheckin.sleep || ''
        };
    }

    // Ensure checkins is an array
    if (!Array.isArray(migrated.checkins)) {
        migrated.checkins = [];
    }

    return migrated;
};

export const useToolkitDetails = () => {
    const [details, setDetails] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                const migrated = migrateData(parsed);
                return migrated;
            }

            // Set default deadline 12 weeks from now for new users
            const defaultDeadline = new Date();
            defaultDeadline.setDate(defaultDeadline.getDate() + 84);
            return {
                ...INITIAL_STATE,
                goals: {
                    ...INITIAL_STATE.goals,
                    deadline: defaultDeadline.toISOString().split('T')[0]
                }
            };
        } catch (error) {
            console.error('Error reading toolkit data:', error);
            return INITIAL_STATE;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
        } catch (error) {
            console.error('Error saving toolkit data:', error);
        }
    }, [details]);

    const updateGoal = (field, value) => {
        setDetails(prev => ({
            ...prev,
            goals: { ...prev.goals, [field]: value }
        }));
    };

    const updateCheckin = (field, value) => {
        setDetails(prev => ({
            ...prev,
            currentCheckin: {
                ...prev.currentCheckin,
                [field]: value
            }
        }));
    };

    const saveCheckin = useCallback(() => {
        const now = new Date();
        const weekStart = new Date(now);
        // Start from Monday (1), not Sunday (0)
        const day = weekStart.getDay();
        const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
        weekStart.setDate(diff);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        const checkin = {
            id: `checkin-${Date.now()}`,
            week_start: weekStart.toISOString().split('T')[0],
            week_end: weekEnd.toISOString().split('T')[0],
            wins: details.currentCheckin.wins,
            struggles: details.currentCheckin.struggles,
            adherence_percent: details.currentCheckin.adherence,
            sessions_completed: details.currentCheckin.sessions,
            avg_steps: details.currentCheckin.steps,
            avg_sleep: details.currentCheckin.sleep,
            next_focus_1: details.currentCheckin.focus[0] || '',
            next_focus_2: details.currentCheckin.focus[1] || '',
            next_focus_3: details.currentCheckin.focus[2] || '',
            created_at: now.toISOString()
        };

        setDetails(prev => ({
            ...prev,
            checkins: [...prev.checkins, checkin],
            currentCheckin: INITIAL_STATE.currentCheckin
        }));

        return checkin;
    }, [details.currentCheckin]);

    const updateHabitList = (index, value) => {
        setDetails(prev => {
            const newList = [...prev.habits.list];
            newList[index] = value;
            return { ...prev, habits: { ...prev.habits, list: newList } };
        });
    };

    const toggleHabit = (date, habitIndex) => {
        setDetails(prev => {
            const currentDay = prev.habits.tracking[date] || {};
            return {
                ...prev,
                habits: {
                    ...prev.habits,
                    tracking: {
                        ...prev.habits.tracking,
                        [date]: {
                            ...currentDay,
                            [habitIndex]: !currentDay[habitIndex]
                        }
                    }
                }
            };
        });
    };

    const clearData = () => {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    };

    const exportData = () => {
        const filename = `tati_toolkit_backup_${new Date().toISOString().split('T')[0]}.json`;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(details, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        // Escape quotes and wrap in quotes if contains comma, newline, or quote
        if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const exportCSV = () => {
        const headers = [
            'week_start', 'week_end', 'wins', 'struggles',
            'adherence_percent', 'sessions_completed', 'avg_steps', 'avg_sleep',
            'next_focus_1', 'next_focus_2', 'next_focus_3', 'created_at'
        ];

        const rows = details.checkins.map(c => [
            escapeCSV(c.week_start),
            escapeCSV(c.week_end),
            escapeCSV(c.wins),
            escapeCSV(c.struggles),
            escapeCSV(c.adherence_percent),
            escapeCSV(c.sessions_completed),
            escapeCSV(c.avg_steps),
            escapeCSV(c.avg_sleep),
            escapeCSV(c.next_focus_1),
            escapeCSV(c.next_focus_2),
            escapeCSV(c.next_focus_3),
            escapeCSV(c.created_at)
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const filename = `tati_checkins_${new Date().toISOString().split('T')[0]}.csv`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", filename);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        URL.revokeObjectURL(url);
    };

    return {
        details,
        updateGoal,
        updateHabitList,
        toggleHabit,
        clearData,
        exportData,
        exportCSV,
        updateCheckin,
        saveCheckin,
        setDetails
    };
};
