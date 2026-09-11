import React from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { UserRole } from '@/types/models';

/**
 * ALLOWED_ROLES_FOR_CREATION is derived from UserRole but excludes 'admin'.
 * Admins can only be created via Supabase console — never via this UI.
 * This const enforces that rule on the frontend without any conditional logic.
 * O(1): it's a compile-time constant, not a runtime filter.
 */
const ALLOWED_ROLES_FOR_CREATION = ['agent', 'buyer'] as const satisfies UserRole[];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        role: 'buyer' as typeof ALLOWED_ROLES_FOR_CREATION[number],
        temporaryPassword: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Add a new user account with an assigned role.
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm text-sm px-3 py-2 border ${
                                    errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                                placeholder="name@havana.com"
                            />
                            {/**
                             * Each Inertia errors key maps to the exact field name.
                             * e.g. errors.email shows under the email input — never as a generic top-level alert.
                             * This is enforced by making StoreUserRequest return field-keyed validation errors.
                             */}
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value as typeof ALLOWED_ROLES_FOR_CREATION[number])}
                                className={`mt-1 block w-full rounded-md shadow-sm text-sm px-3 py-2 border bg-white ${
                                    errors.role ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                            >
                                {ALLOWED_ROLES_FOR_CREATION.map((role) => (
                                    <option key={role} value={role} className="capitalize">
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                            )}
                        </div>

                        {/* Temporary Password */}
                        <div>
                            <label htmlFor="temporaryPassword" className="block text-sm font-medium text-gray-700">
                                Temporary Password
                            </label>
                            <input
                                id="temporaryPassword"
                                type="password"
                                value={data.temporaryPassword}
                                onChange={(e) => setData('temporaryPassword', e.target.value)}
                                className={`mt-1 block w-full rounded-md shadow-sm text-sm px-3 py-2 border ${
                                    errors.temporaryPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.temporaryPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.temporaryPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
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
                                {processing ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
