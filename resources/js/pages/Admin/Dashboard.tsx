import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export interface AdminStats {
    totalUsers: number;
    totalProperties: number;
    activeListings: number;
    newInquiries: number;
}

export default function Dashboard({ stats }: { stats: AdminStats }) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard - Havana" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-sm text-gray-500">Live operational metrics and real estate management controls.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/properties/create"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition"
                    >
                        + New Property
                    </Link>
                    <Link
                        href="/admin/inquiries"
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition"
                    >
                        View Inquiries
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</h3>
                        <p className="mt-1 text-3xl font-black text-gray-900">{stats.totalUsers}</p>
                        <Link href="/admin/users" className="text-xs text-indigo-600 hover:underline font-semibold mt-2 inline-block">
                            Manage users &rarr;
                        </Link>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                        👥
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Listings</h3>
                        <p className="mt-1 text-3xl font-black text-gray-900">{stats.totalProperties}</p>
                        <Link href="/admin/properties" className="text-xs text-indigo-600 hover:underline font-semibold mt-2 inline-block">
                            View inventory &rarr;
                        </Link>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                        🏡
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Listings</h3>
                        <p className="mt-1 text-3xl font-black text-emerald-600">{stats.activeListings}</p>
                        <span className="text-[11px] text-gray-400 mt-2 inline-block">Live on public search</span>
                    </div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                        ✨
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Inquiries</h3>
                        <p className="mt-1 text-3xl font-black text-amber-600">{stats.newInquiries}</p>
                        <Link href="/admin/inquiries" className="text-xs text-amber-600 hover:underline font-semibold mt-2 inline-block">
                            Review leads &rarr;
                        </Link>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl font-bold">
                        📩
                    </div>
                </div>
            </div>

            {/* Quick Hub Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/admin/properties"
                    className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group"
                >
                    <span className="text-2xl mb-3 block">🏢</span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">Property Management</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Create listings, upload photo galleries, adjust pricing in PHP, and update availability status.
                    </p>
                </Link>

                <Link
                    href="/admin/inquiries"
                    className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group"
                >
                    <span className="text-2xl mb-3 block">📅</span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">Lead Pipeline & Tours</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        Track tour inspection appointments, client financing choices, and agent contact notes.
                    </p>
                </Link>

                <Link
                    href="/admin/users"
                    className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group"
                >
                    <span className="text-2xl mb-3 block">🛡️</span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition">User & Role Management</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                        View client and agent accounts, change permissions, and suspend unauthorized users.
                    </p>
                </Link>
            </div>
        </AdminLayout>
    );
}
