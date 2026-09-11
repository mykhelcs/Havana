import React from 'react';
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Users</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Properties</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Listings</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.activeListings}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">New Inquiries</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stats.newInquiries}</p>
                </div>
            </div>
        </AdminLayout>
    );
}
