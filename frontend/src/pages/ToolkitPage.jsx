import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Shield, Download, Trash2 } from 'lucide-react';
import ToolkitTabs from '../components/toolkit/ToolkitTabs';
import GoalsModule from '../components/toolkit/GoalsModule';
import HabitsModule from '../components/toolkit/HabitsModule';
import CheckInModule from '../components/toolkit/CheckInModule';
import { useToolkitDetails } from '../hooks/useToolkitDetails';
import { toast } from 'sonner';

import ConfirmationModal from '../components/ConfirmationModal';

const ToolkitPage = () => {
    const [activeTab, setActiveTab] = useState('goals');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const {
        details,
        updateGoal,
        updateHabitList,
        updateCheckin,
        toggleHabit,
        clearData,
        exportData,
        exportCSV,
        saveCheckin
    } = useToolkitDetails();

    const handleResetConfirm = () => {
        clearData();
        setIsResetModalOpen(false);
    };

    return (
        <PageLayout>
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleResetConfirm}
                title="Reset Toolkit Data?"
                message="This will permanently delete all your tracking data from this device. This action cannot be undone."
                confirmText="Yes, Reset Everything"
                variant="danger"
            />

            <section className="relative section pt-12 md:pt-20">
                <div className="container relative z-10 max-w-4xl">
                    <div className="text-center mb-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] mb-6 animate-fade-up">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-coral)]"></span>
                            <span className="text-label text-[var(--accent-sage)] tracking-widest">TRANSFORMATIONS / TOOLKIT</span>
                        </div>

                        <h1 className="text-display mb-6 animate-fade-up animate-delay-1 leading-tight">
                            Client Toolkit
                        </h1>

                        {/* Security Banner */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--accent-sage)]/30 text-[var(--text-muted)] text-sm mb-8 animate-fade-up animate-delay-2 max-w-lg mx-auto">
                            <Shield size={14} className="text-[var(--accent-sage)] flex-shrink-0" />
                            <span>Your data stays on this device unless you export it.</span>
                        </div>

                        <div className="flex justify-center gap-4 animate-fade-up animate-delay-2 mb-10">
                            <button onClick={exportData} className="btn-ghost text-xs gap-2 py-2 px-4 h-auto border border-[var(--border)] rounded-full hover:bg-[var(--bg-elevated)]">
                                <Download size={14} /> Backup JSON
                            </button>
                            <button
                                onClick={exportCSV}
                                className="btn-ghost text-xs gap-2 py-2 px-4 h-auto border border-[var(--brand-coral)] text-[var(--brand-coral)] rounded-full hover:bg-[var(--brand-coral)] hover:text-white transition-colors"
                            >
                                <Download size={14} /> Export Report (CSV)
                            </button>
                            <button
                                onClick={() => setIsResetModalOpen(true)}
                                className="btn-ghost text-xs gap-2 py-2 px-4 h-auto text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 size={14} /> Reset
                            </button>
                        </div>
                    </div>

                    <ToolkitTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                    <div className="min-h-[500px]">
                        {activeTab === 'goals' && (
                            <GoalsModule
                                goals={details.goals}
                                updateGoal={updateGoal}
                            />
                        )}
                        {activeTab === 'habits' && (
                            <HabitsModule
                                habits={details.habits}
                                list={details.habits.list}
                                updateHabitList={updateHabitList}
                                toggleHabit={toggleHabit}
                            />
                        )}
                        {activeTab === 'checkin' && (
                            <CheckInModule
                                checkinData={details.currentCheckin}
                                updateCheckin={updateCheckin}
                                saveCheckin={saveCheckin}
                                checkinHistory={details.checkins}
                            />
                        )}
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default ToolkitPage;
