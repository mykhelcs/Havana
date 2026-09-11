import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PaginatedUsers, User, UserListFilters, UserRole, UserStatus } from '@/types/models';

interface IndexProps {
    users: PaginatedUsers;
    filters: UserListFilters;
}

/**
 * ROLE_BADGE_STYLE is a const record keyed by UserRole.
 * O(1) lookup â€” no switch/if chain to pick the badge color.
 * Adding a new role = one line in this object, nowhere else.
 */
const ROLE_BADGE_STYLE: Record<UserRole, string> = {
    admin: 'bg-[#0D1B2A] text-[#C9A84C] border border-[#C9A84C]/30',
    agent: 'bg-blue-100 text-blue-800 border border-blue-200',
    buyer: 'bg-gray-100 text-gray-800 border border-gray-200',
};

/**
 * STATUS_BADGE_STYLE same pattern for UserStatus.
 * active = green tint, suspended = red tint.
 */
const STATUS_BADGE_STYLE: Record<UserStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    suspended: 'bg-red-50 text-red-700 border border-red-200',
};

export default function Index({ users, filters }: IndexProps) {
    const [confirmingSuspendId, setConfirmingSuspendId] = useState<string | null>(null);

    const handleFilterChange = (newFilterKey: keyof UserListFilters, value: string) => {
        const updatedFilters: UserListFilters = {
            ...filters,
            [newFilterKey]: value || undefined,
        };

        router.get('/admin/users', updatedFilters as Record<string, any>, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSuspend = (user: User) => {
        router.patch(`/admin/users/${user.id}/suspend`, {}, {
            preserveState: true,
            onSuccess: () => {
                setConfirmingSuspendId(null);
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get('/admin/users', { ...filters, page }, {
            preserveState: true,
        });
    };

    return (
        <AdminLayout>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage platform accounts, roles, and access status</p>
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => router.get('/admin/users/create')}
                        className="inline-flex items-center px-4 py-2 bg-[#0D1B2A] text-white text-sm font-medium rounded-md hover:bg-opacity-90 shadow-sm transition-colors"
                    >
                        + Create User
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="searchEmail" className="block text-xs font-medium text-gray-700 mb-1">
                            Search Email
                        </label>
                        <input
                            id="searchEmail"
                            type="text"
                            defaultValue={filters.searchEmail || ''}
                            onBlur={(e) => handleFilterChange('searchEmail', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilterChange('searchEmail', (e.target as HTMLInputElement).value);
                                }
                            }}
                            placeholder="user@example.com"
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border"
                        />
                    </div>

                    <div>
                        <label htmlFor="roleFilter" className="block text-xs font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            id="roleFilter"
                            value={filters.role || ''}
                            onChange={(e) => handleFilterChange('role', e.target.value as UserRole)}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border bg-white"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="agent">Agent</option>
                            <option value="buyer">Buyer</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="statusFilter" className="block text-xs font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="statusFilter"
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange('status', e.target.value as UserStatus)}
                            className="w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2 border bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Login
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                        No users found matching the filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${ROLE_BADGE_STYLE[user.role] ?? 'bg-gray-100 text-gray-800'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE_STYLE[user.status] ?? 'bg-gray-100 text-gray-800'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'â€”'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => router.get(`/admin/users/${user.id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Edit
                                                </button>

                                                {user.status !== 'suspended' && (
                                                    confirmingSuspendId === user.id ? (
                                                        <div className="inline-flex items-center space-x-1.5 bg-red-50 p-1 rounded border border-red-200">
                                                            <span className="text-xs text-red-700 font-normal">Are you sure?</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSuspend(user)}
                                                                className="text-xs font-bold text-red-700 hover:text-red-900 px-1 hover:underline"
                                                            >
                                                                Yes
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setConfirmingSuspendId(null)}
                                                                className="text-xs text-gray-500 hover:text-gray-700 px-1"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmingSuspendId(user.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Suspend
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Page <span className="font-medium">{users.currentPage}</span> of{' '}
                        <span className="font-medium">{users.lastPage || 1}</span> ({users.total} total)
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            disabled={users.currentPage <= 1}
                            onClick={() => handlePageChange(users.currentPage - 1)}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={users.currentPage >= users.lastPage}
                            onClick={() => handlePageChange(users.currentPage + 1)}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
