import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tati_toolkit_v1';

const INITIAL_STATE = {
    goals: {
        title: '',
        metricType: 'adherence', // adherence, strength, steps, measurements, body_weight, sleep, other
        baseline: '',
        target: '',
        deadline: '', // Will be set to 12 weeks from now on first load if empty
        focusActions: ['', '', ''],
        progress: 0,
        milestones: [] // { week: 1, value: '', achieved: false }
    },
    habits: {
        list: [
            'Protein target hit',
            'Steps goal hit',
            'Workout completed',
            'Sleep 7+ hours',
            'Balanced plate (2 meals)'
        ],
        tracking: {} // { "2024-01-29": { 0: true, 1: false } }
    },
    checkins: {
        lastCheckin: null,
        history: [] // { date: '', wins: '', struggles: '', stats: {} }
    }
};

export const useToolkitDetails = () => {
    const [details, setDetails] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) return JSON.parse(stored);

            // Set default deadline 12 weeks from now for new users
            const defaultDeadline = new Date();
            defaultDeadline.setDate(defaultDeadline.getDate() + 84); // 12 weeks
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
        if (window.confirm('Are you sure? This will delete all your tracked data locally.')) {
            setDetails(INITIAL_STATE);
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload(); // Ensure clean state
        }
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(details));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `tonedwithtati_toolkit_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const exportCSV = () => {
        // Flatten state for CSV
        // For habits, we will sum up the total completed manually for 'sessions_completed'
        // adherence_percent will be based on the configured habits

        let sessionsCompleted = 0;
        let totalPossible = 0;
        const habitCount = details.habits.list.filter(h => h.trim() !== '').length;

        if (habitCount > 0) {
            Object.values(details.habits.tracking).forEach(day => {
                Object.keys(day).forEach(key => {
                    // Check if this index corresponds to a valid habit
                    if (key < habitCount && day[key]) sessionsCompleted++;
                });
            });
            // Approximate total usage - this is tricky without a start date, 
            // but for a snapshot we can just report what's tracked.
        }

        const data = {
            week_start: new Date().toISOString().split('T')[0], // Snapshot date
            week_end: new Date().toISOString().split('T')[0],
            goal_title: details.goals.title,
            metric_type: details.goals.metricType,
            baseline: details.goals.baseline,
            target: details.goals.target,
            current_value: details.goals.progress,
            // Use current draft data for report
            adherence_percent: details.checkins.currentCheckin.adherence || '0',
            sessions_completed: sessionsCompleted,
            avg_steps: details.checkins.currentCheckin.steps || '0',
            avg_sleep: 'N/A',
            wins: details.checkins.currentCheckin.wins,
            struggles: details.checkins.currentCheckin.struggles,
            next_focus_1: details.checkins.currentCheckin.focus[0] || details.goals.focusActions[0] || '',
            next_focus_2: details.checkins.currentCheckin.focus[1] || details.goals.focusActions[1] || '',
            next_focus_3: details.checkins.currentCheckin.focus[2] || details.goals.focusActions[2] || ''
        };

        const headers = Object.keys(data).join(',');
        const values = Object.values(data).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(headers + '\n' + values);

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", csvContent);
        downloadAnchorNode.setAttribute("download", `tati_toolkit_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return {
        details,
        updateGoal,
        updateHabitList,
        toggleHabit,
        clearData,
        exportData,
        exportCSV,
        setDetails // Exposed for import/restore if needed later
    };
};
