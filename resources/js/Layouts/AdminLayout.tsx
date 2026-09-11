import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { User } from '@/types/auth'; // Assuming there's an auth type

interface SharedProps {
    auth: {
        user: User;
    };
    [key: string]: any;
}

const ADMIN_NAV = [
    { name: 'Dashboard', href: '/admin', activeUrl: '/admin' },
    { name: 'Users', href: '/admin/users', activeUrl: '/admin/users' },
    { name: 'Properties', href: '/admin/properties', activeUrl: '/admin/properties' },
    { name: 'Inquiries', href: '/admin/inquiries', activeUrl: '/admin/inquiries' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const page = usePage<SharedProps>();
    const { auth } = page.props;
    const url = page.url;
    const user = auth.user;

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0" style={{ backgroundColor: '#0D1B2A' }}>
                <div className="h-16 flex items-center px-6 border-b border-gray-800">
                    <span className="text-white text-xl font-bold tracking-widest invisible md:visible">HAVANA</span>
                </div>
                <nav className="mt-6 px-4 space-y-1">
                    {ADMIN_NAV.map((item) => {
                        const isActive = url.startsWith(item.activeUrl);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`block px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                }`}
                                style={isActive ? { borderLeft: '4px solid #C9A84C', backgroundColor: 'rgba(255,255,255,0.05)' } : {}}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex-1 flex items-center">
                        <span className="text-xl font-bold tracking-widest text-gray-900 md:hidden">HAVANA</span>
                        <span className="text-xl font-bold tracking-widest text-gray-900 hidden md:block">HAVANA</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600 font-medium">
                            {user?.email} &middot; Admin
                        </span>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                        >
                            Logout
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
