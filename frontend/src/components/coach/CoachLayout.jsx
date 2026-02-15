import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    LayoutDashboard,
    Inbox,
    Users,
    Settings,
    LogOut,
    Target
} from 'lucide-react';

const CoachLayout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/coach/login');
    };

    const navItems = [
        { to: '/coach/dashboard', icon: LayoutDashboard, label: 'Today' },
        { to: '/coach/inbox', icon: Inbox, label: 'Inbox' },
        { to: '/coach/clients', icon: Users, label: 'Clients' },
        { to: '/coach/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-base)] pt-20">
            <div className="flex">
                {/* Sidebar */}
                <aside className="fixed left-0 top-20 bottom-0 w-64 bg-[var(--bg-card)] border-r border-[var(--border)] p-4 flex flex-col">
                    <div className="flex items-center gap-3 px-3 py-2 mb-6">
                        <div className="w-10 h-10 rounded-full bg-[var(--brand-coral)] flex items-center justify-center">
                            <Target size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-heading text-sm font-semibold text-[var(--text-primary)]">Coach Panel</h2>
                            <p className="text-xs text-[var(--text-muted)]">Manage your clients</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${isActive
                                        ? 'bg-[var(--brand-coral)] text-white'
                                        : 'text-[var(--text-body)] hover:bg-[var(--bg-elevated)]'
                                    }`
                                }
                            >
                                <item.icon size={18} />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--brand-coral)] hover:bg-[var(--bg-elevated)] transition-all mt-auto"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </aside>

                {/* Main content */}
                <main className="flex-1 ml-64 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CoachLayout;
