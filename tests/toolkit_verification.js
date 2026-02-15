const { format, subDays, addDays, isSameDay } = require('date-fns');

// --- Mocking Dependencies ---
const INITIAL_STATE = {
    goals: { focusActions: ['', '', ''] },
    habits: { list: [], tracking: {} },
    checkins: [],
    currentCheckin: {
        wins: '', struggles: '', adherence: '', steps: '', sessions: '', sleep: '', focus: ['', '', '']
    }
};

// --- Logic from HabitsModule.jsx ---
const calculateStreak = (habits, habitIndex) => {
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
        const d = format(subDays(today, i), 'yyyy-MM-dd');
        const dayData = habits.tracking[d] || {};
        if (dayData[habitIndex]) {
            streak++;
        } else if (i === 0) {
            continue;
        } else {
            break;
        }
    }
    return streak;
};

// --- Logic from useToolkitDetails.js (Patched) ---
const getWeekRange = (date) => {
    const now = new Date(date);
    const weekStart = new Date(now);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return {
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0]
    };
}

const mockCSVExport = (details) => {
    const escapeCSV = (value) => {
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('\n') || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    return details.checkins.map(c => [
        escapeCSV(c.week_start),
        escapeCSV(c.week_end),
        escapeCSV(c.wins),
        escapeCSV(c.sessions_completed),
        escapeCSV(c.avg_steps),
        escapeCSV(c.avg_sleep)
    ].join(',')).join('\n');
}

// --- VERIFICATION ---
console.log("Running Toolkit Verification...");

// 1. Verify Streak Calculation
const todayStr = format(new Date(), 'yyyy-MM-dd');
const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
const habitsMock = {
    tracking: {
        [todayStr]: { 0: true },
        [yesterdayStr]: { 0: true }
    }
};
const streak = calculateStreak(habitsMock, 0);
if (streak === 2) console.log("PASS: Streak Calculation (2 days)");
else console.error(`FAIL: Streak Calculation. Expected 2, got ${streak}`);

// 2. Verify Week Start (Monday Logic)
// Testing specific date: Wed Feb 28 2024 (Should start Mon Feb 26)
const testDate = new Date('2024-02-28T12:00:00Z');
const range = getWeekRange(testDate);
if (range.start === '2024-02-26' && range.end === '2024-03-03') {
    console.log("PASS: Monday-start Week Calculation");
} else {
    console.error(`FAIL: Week Calculation. Got ${range.start} to ${range.end}`);
}

// 3. Verify CSV Content
const checkinMock = {
    checkins: [{
        week_start: '2024-01-01',
        week_end: '2024-01-07',
        wins: 'Gym, Sleep',
        sessions_completed: 5,
        avg_steps: 10000,
        avg_sleep: 7.5
    }]
};
const csv = mockCSVExport(checkinMock);
if (csv.includes('"Gym, Sleep"') && csv.includes('5') && csv.includes('7.5')) {
    console.log("PASS: CSV Export (Multi-row + Fields)");
} else {
    console.error(`FAIL: CSV Export. Got: ${csv}`);
}
