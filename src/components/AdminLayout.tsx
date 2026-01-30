
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Package,
    Settings as SettingsIcon,
    LogOut,
    Store
} from 'lucide-react';
import clsx from 'clsx';

const AdminLayout: React.FC = () => {
    const { session, signOut, loading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!loading && !session) {
            navigate('/login', { replace: true, state: { from: location } });
        }
    }, [session, loading, navigate, location]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!session) return null;

    const navItems = [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Settings', href: '/admin/settings', icon: SettingsIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#120c08] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-[#1c140e] border-r border-gray-200 dark:border-gray-800 flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={clsx(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Store className="w-5 h-5" />
                        View Store
                    </Link>
                    <button
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {/* Mobile Header */}
                <header className="md:hidden bg-white dark:bg-[#1c140e] border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
                    </div>
                    {/* Simple mobile menu trigger could go here, for now just basic header */}
                </header>

                {/* Mobile Nav Links (Simple version) */}
                <div className="md:hidden flex overflow-x-auto p-2 bg-white dark:bg-[#1c140e] border-b border-gray-200 dark:border-gray-800 gap-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={clsx(
                                'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border',
                                location.pathname.startsWith(item.href)
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">Store</Link>
                </div>

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
