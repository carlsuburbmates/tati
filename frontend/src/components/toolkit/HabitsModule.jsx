import React, { useMemo } from 'react';
import { CalendarCheck, Flame, PieChart, Trophy } from 'lucide-react';
import { format, subDays, addDays, isSameDay } from 'date-fns';

const HabitsModule = ({ habits, list, updateHabitList, toggleHabit }) => {
    const today = new Date();
    const startDate = subDays(today, 27); // 4 weeks back

    const dates = useMemo(() => {
        const d = [];
        for (let i = 0; i < 28; i++) {
            d.push(addDays(startDate, i));
        }
        return d;
    }, [startDate]);

    const calculateStreak = (habitIndex) => {
        let streak = 0;
        for (let i = 0; i < 365; i++) { // Check up to a year
            const d = format(subDays(today, i), 'yyyy-MM-dd');
            const dayData = habits.tracking[d] || {};
            if (dayData[habitIndex]) {
                streak++;
            } else if (i === 0) {
                // If today isn't checked yet, don't break streak from yesterday
                continue;
            } else {
                break;
            }
        }
        return streak;
    };

    const calculateBestStreak = (habitIndex) => {
        // Get all dates with tracking data, sorted
        const allDates = Object.keys(habits.tracking).sort();
        if (allDates.length === 0) return 0;

        let bestStreak = 0;
        let currentStreak = 0;
        let prevDate = null;

        for (const dateStr of allDates) {
            const dayData = habits.tracking[dateStr] || {};
            if (dayData[habitIndex]) {
                if (prevDate) {
                    const prev = new Date(prevDate);
                    const curr = new Date(dateStr);
                    const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
                    if (diffDays === 1) {
                        currentStreak++;
                    } else {
                        currentStreak = 1;
                    }
                } else {
                    currentStreak = 1;
                }
                bestStreak = Math.max(bestStreak, currentStreak);
                prevDate = dateStr;
            } else {
                currentStreak = 0;
                prevDate = null;
            }
        }

        return bestStreak;
    };

    const calculateAdherence = (period = 'weekly', habitIndex) => {
        const daysToCheck = period === 'weekly' ? 7 : 28;
        let completed = 0;

        for (let i = 0; i < daysToCheck; i++) {
            const d = format(subDays(today, i), 'yyyy-MM-dd');
            const dayData = habits.tracking[d] || {};
            if (dayData[habitIndex]) completed++;
        }

        return Math.round((completed / daysToCheck) * 100);
    };

    const calculateOverallAdherence = () => {
        const activeHabits = list.filter(h => h.trim() !== '').length;
        if (activeHabits === 0) return 0;

        let totalAdherence = 0;
        list.forEach((h, idx) => {
            if (h.trim() !== '') {
                totalAdherence += calculateAdherence('monthly', idx);
            }
        });

        return Math.round(totalAdherence / activeHabits);
    };

    return (
        <div className="card bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm p-6 md:p-8 animate-fade-up animate-delay-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--accent-sage)]">
                        <CalendarCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-h3 font-display text-[var(--text-primary)]">Habit Consistency</h2>
                        <p className="text-sm text-[var(--text-muted)]">Small daily actions create big results.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-elevated)] rounded-lg border border-[var(--border)]">
                    <PieChart size={18} className="text-[var(--brand-coral)]" />
                    <div>
                        <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block">Monthly Adherence</span>
                        <span className="font-heading text-lg text-[var(--text-primary)]">{calculateOverallAdherence()}%</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                <table className="w-full min-w-[750px] border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left py-4 px-4 text-label text-[var(--accent-sage)] w-1/5">Habit Name</th>
                            <th className="text-left py-4 px-4 text-label text-[var(--accent-sage)]">Last 4 Weeks</th>
                            <th className="text-center py-4 px-4 text-label text-[var(--accent-sage)] w-28">Streak</th>
                            <th className="text-center py-4 px-4 text-label text-[var(--accent-sage)] w-20">Week %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                        {list.map((habitName, habitIndex) => {
                            const currentStreak = calculateStreak(habitIndex);
                            const bestStreak = calculateBestStreak(habitIndex);

                            return (
                                <tr key={habitIndex} className="group hover:bg-[var(--bg-elevated)]/50 transition-colors">
                                    <td className="py-4 px-4 align-middle">
                                        <input
                                            type="text"
                                            value={habitName}
                                            onChange={(e) => updateHabitList(habitIndex, e.target.value)}
                                            placeholder={`Habit ${habitIndex + 1}`}
                                            className="w-full bg-transparent border-b border-transparent focus:border-[var(--brand-coral)] focus:outline-none transition-colors text-[var(--text-body)] font-medium placeholder:text-[var(--text-muted)]/40 p-1"
                                        />
                                    </td>
                                    <td className="py-4 px-4 align-middle">
                                        <div className="flex gap-1.5 items-center">
                                            {dates.map((date) => {
                                                const dateKey = format(date, 'yyyy-MM-dd');
                                                const dayData = habits.tracking[dateKey] || {};
                                                const isCompleted = !!dayData[habitIndex];
                                                const isToday = isSameDay(date, today);

                                                return (
                                                    <button
                                                        key={dateKey}
                                                        onClick={() => toggleHabit(dateKey, habitIndex)}
                                                        title={`${format(date, 'MMM d')}${isCompleted ? ' - Completed' : ''}`}
                                                        className={`
                                                            w-7 h-9 rounded-md transition-all duration-200 border flex-shrink-0
                                                            ${isCompleted
                                                                ? 'bg-[var(--accent-sage)] border-[var(--accent-sage)]'
                                                                : 'bg-[var(--bg-base)] border-[var(--border)] hover:border-[var(--text-muted)]'
                                                            }
                                                            ${isToday ? 'ring-2 ring-[var(--brand-coral)] ring-offset-2 ring-offset-[var(--bg-card)]' : ''}
                                                        `}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center align-middle">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className={`flex items-center justify-center gap-1 font-heading ${currentStreak > 0 ? 'text-[var(--brand-coral)]' : 'text-[var(--text-muted)]'}`}>
                                                <Flame size={18} className={currentStreak > 0 ? 'fill-current' : ''} />
                                                {currentStreak}
                                            </div>
                                            {bestStreak > 0 && (
                                                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                                                    <Trophy size={12} />
                                                    <span>Best: {bestStreak}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center align-middle">
                                        <span className="text-sm font-medium text-[var(--text-muted)]">
                                            {calculateAdherence('weekly', habitIndex)}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-6 text-center">
                Tip: Click grid squares to toggle daily habits.
            </p>
        </div>
    );
};

export default HabitsModule;
