import React from 'react';
import { Target, CalendarCheck, ClipboardCheck } from 'lucide-react';

const ToolkitTabs = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'habits', label: 'Habits', icon: CalendarCheck },
        { id: 'checkin', label: 'Weekly Check-in', icon: ClipboardCheck },
    ];

    return (
        <div className="flex p-1 mb-10 bg-[var(--bg-card)] rounded-full border border-[var(--border)] w-fit mx-auto shadow-sm animate-fade-up animate-delay-2">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${isActive
                                ? 'bg-[var(--brand-coral)] text-white shadow-md transform scale-105'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)]'
                            }
            `}
                    >
                        <Icon size={16} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default ToolkitTabs;
