import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User, UserRole, UserStatus } from '@/types/models';

interface EditProps {
    user: User;
}

const ALL_ROLES: UserRole[] = ['admin', 'agent', 'buyer'];

export default function Edit({ user }: EditProps) {
    const [showSaved, setShowSaved] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        role: user.role,
        status: user.status,
    });

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (showSaved) {
            timer = setTimeout(() => {
                setShowSaved(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [showSaved]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowSaved(true);
            },
        });
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Modify role and access status for <span className="font-semibold text-gray-700">{user.email}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.get('/admin/users')}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        &larr; Back to Users
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    {/* User Metadata Overview */}
                    <div className="mb-6 bg-gray-50 rounded-md p-4 border border-gray-100 text-xs text-gray-600 space-y-1">
                        <div><span className="font-medium text-gray-700">User ID:</span> {user.id}</div>
                        <div><span className="font-medium text-gray-700">Created:</span> {user.createdAt ? new Date(user.createdAt).toLocaleString() : '—'}</div>
                        <div><span className="font-medium text-gray-700">Last Login:</span> {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email (Readonly) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={user.email}
                                className="mt-1 block w-full rounded-md shadow-sm text-sm px-3 py-2 border border-gray-200 bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                        </div>

                        {/* Role Select */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as UserRole)}
                                className={`mt-1 block w-full rounded-md shadow-sm text-sm px-3 py-2 border bg-white ${
                                    errors.role ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                            >
                                {ALL_ROLES.map((role) => (
                                    <option key={role} value={role} className="capitalize">
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                            )}
                        </div>

                        {/* Status Toggle / Select */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <div className="mt-2 flex items-center space-x-6">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={data.status === 'active'}
                                        onChange={() => setData('status', 'active')}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 font-medium">Active</span>
                                </label>
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="suspended"
                                        checked={data.status === 'suspended'}
                                        onChange={() => setData('status', 'suspended')}
                                        className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 font-medium">Suspended</span>
                                </label>
                            </div>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        {/* Form actions and Saved confirmation */}
                        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                            <div>
                                {showSaved && (
                                    <span className="inline-flex items-center text-sm font-semibold text-emerald-600 transition-opacity duration-200">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Saved
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => router.get('/admin/users')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#0D1B2A] text-white text-sm font-medium rounded-md hover:bg-opacity-90 shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
