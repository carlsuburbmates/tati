import React from 'react';
import { Target, Calendar, CheckCircle, Wand2 } from 'lucide-react';

const GoalsModule = ({ goals, updateGoal }) => {

    const templates = [
        {
            name: 'Consistency First',
            data: { title: 'Improve Weekly Adherence', metricType: 'adherence', baseline: '55', target: '80' }
        },
        {
            name: 'Steps + Energy',
            data: { title: 'Daily Step Count', metricType: 'steps', baseline: '6000', target: '9000' }
        },
        {
            name: 'Strength Builder',
            data: { title: 'Hip Thrust Strength (8 reps)', metricType: 'strength', baseline: '40', target: '70' }
        },
        {
            name: 'Balanced Plate',
            data: { title: 'Nutrition Adherence', metricType: 'adherence', baseline: '50', target: '75' }
        },
        {
            name: 'Sleep & Recovery',
            data: { title: 'Hours of Sleep', metricType: 'sleep', baseline: '6.0', target: '7.5' }
        },
    ];

    const applyTemplate = (e) => {
        const templateName = e.target.value;
        const template = templates.find(t => t.name === templateName);
        if (template) {
            updateGoal('title', template.data.title);
            updateGoal('metricType', template.data.metricType);
            updateGoal('baseline', template.data.baseline);
            updateGoal('target', template.data.target);

            // Auto generate milestones if both are numbers
            generateMilestones(template.data.baseline, template.data.target);
        }
    };

    const generateMilestones = (start, end) => {
        const startVal = parseFloat(start);
        const endVal = parseFloat(end);

        if (!isNaN(startVal) && !isNaN(endVal)) {
            const diff = endVal - startVal;
            const step = diff / 12;
            const newMilestones = [];

            for (let i = 1; i <= 12; i++) {
                const val = (startVal + (step * i)).toFixed(1).replace(/\.0$/, '');
                newMilestones.push({ week: i, value: val, achieved: false });
            }
            updateGoal('milestones', newMilestones);
        }
    };

    // Trigger generation when manually blurring baseline/target if actionable? 
    // Maybe just a button or implicit? Let's add a small action for it.

    return (
        <div className="card bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)] shadow-sm p-6 md:p-8 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--brand-coral)]">
                        <Target size={24} />
                    </div>
                    <div>
                        <h2 className="text-h3 font-display text-[var(--text-primary)]">Focus Goal</h2>
                        <p className="text-sm text-[var(--text-muted)]">What's your main priority right now?</p>
                    </div>
                </div>

                <div className="relative min-w-[200px]">
                    <select
                        onChange={applyTemplate}
                        defaultValue=""
                        className="w-full p-2 pl-3 pr-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-coral)] appearance-none cursor-pointer"
                    >
                        <option value="" disabled>✨ Start with a template...</option>
                        {templates.map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                    </select>
                    <Wand2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-coral)] pointer-events-none" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                    <label className="block text-label text-[var(--accent-sage)] mb-3">Goal Title</label>
                    <input
                        type="text"
                        value={goals.title}
                        onChange={(e) => updateGoal('title', e.target.value)}
                        placeholder="e.g., Run 5km without stopping"
                        className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]/50 text-[var(--text-primary)]"
                    />
                    <p className="text-xs text-[var(--text-muted)] mt-2">Be specific and measurable.</p>
                </div>

                <div>
                    <label className="block text-label text-[var(--accent-sage)] mb-3">Metric Type</label>
                    <div className="relative">
                        <select
                            value={goals.metricType}
                            onChange={(e) => updateGoal('metricType', e.target.value)}
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all appearance-none text-[var(--text-primary)]"
                        >
                            <option value="adherence">Adherence %</option>
                            <option value="strength">Strength (kg/lbs)</option>
                            <option value="steps">Steps</option>
                            <option value="measurements">Measurements (cm/in)</option>
                            <option value="body_weight">Body Weight</option>
                            <option value="sleep">Sleep (Hours)</option>
                            <option value="other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-3">Baseline</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={goals.baseline}
                            onChange={(e) => updateGoal('baseline', e.target.value)}
                            onBlur={() => generateMilestones(goals.baseline, goals.target)}
                            placeholder="Start"
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-label text-[var(--accent-sage)] mb-3">Target</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={goals.target}
                            onChange={(e) => updateGoal('target', e.target.value)}
                            onBlur={() => generateMilestones(goals.baseline, goals.target)}
                            placeholder="End"
                            className="w-full p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-label text-[var(--accent-sage)] mb-3">Deadline</label>
                    <div className="relative">
                        <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                        <input
                            type="date"
                            value={goals.deadline}
                            onChange={(e) => updateGoal('deadline', e.target.value)}
                            className="w-full p-4 pl-12 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] focus:border-[var(--brand-coral)] focus:ring-1 focus:ring-[var(--brand-coral)] focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Milestones Preview */}
            {goals.milestones && goals.milestones.length > 0 && (
                <div className="mb-10 p-6 bg-[var(--bg-base)] rounded-xl border border-[var(--border)]">
                    <h4 className="text-label text-[var(--accent-sage)] mb-4">Milestone Roadmap</h4>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {goals.milestones.map((m) => (
                            <div key={m.week} className="text-center p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                                <span className="block text-xs text-[var(--text-muted)] uppercase">Week {m.week}</span>
                                <span className="font-heading text-[var(--brand-coral)]">{m.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-10 p-6 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border)]">
                <label className="block text-label text-[var(--accent-sage)] mb-4">
                    Weekly Focus Actions <span className="text-[var(--text-muted)] normal-case text-xs tracking-normal ml-2">(What 3 things will move the needle?)</span>
                </label>
                <div className="space-y-3">
                    {goals.focusActions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-3 group">
                            <CheckCircle size={20} className="text-[var(--border)] group-focus-within:text-[var(--brand-coral)] transition-colors" />
                            <input
                                type="text"
                                value={action}
                                onChange={(e) => {
                                    const newActions = [...goals.focusActions];
                                    newActions[idx] = e.target.value;
                                    updateGoal('focusActions', newActions);
                                }}
                                placeholder={`Action ${idx + 1}`}
                                className="w-full bg-transparent border-b border-[var(--border)] p-2 focus:border-[var(--brand-coral)] focus:outline-none transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-label text-[var(--accent-sage)]">Progress</label>
                    <span className="font-heading text-[var(--brand-coral)] text-lg">{goals.progress}%</span>
                </div>
                <div className="relative w-full h-3 bg-[var(--bg-base)] rounded-full overflow-hidden border border-[var(--border)]">
                    <div
                        className="absolute top-0 left-0 h-full bg-[var(--brand-coral)] rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${goals.progress}%` }}
                    />
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={goals.progress}
                    onChange={(e) => updateGoal('progress', parseInt(e.target.value))}
                    className="w-full mt-4 h-2 bg-transparent rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[var(--bg-card)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--brand-coral)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
                />
            </div>
        </div>
    );
};

export default GoalsModule;
