import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type PropertyItem = {
    id: string;
    title: string;
    listingType: string;
    propertyType: string;
    priceFormatted: string;
    status: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    isFeatured: boolean;
    images: string[];
    createdAt: string;
};

type Props = {
    properties: {
        data: PropertyItem[];
        total: number;
        currentPage: number;
        lastPage: number;
    };
    filters: {
        status?: string;
        listing_type?: string;
        search?: string;
    };
};

export default function Index({ properties, filters }: Props) {
    const handleStatusChange = (id: string, newStatus: string) => {
        router.patch(`/admin/properties/${id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AdminLayout>
            <Head title="Property Management - Havana Admin" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Property Listings</h1>
                    <p className="text-sm text-gray-500">Manage real estate listings, pricing, and availability.</p>
                </div>
                <div>
                    <Link
                        href="/admin/properties/create"
                        className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition"
                    >
                        + Add New Property
                    </Link>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search by title, city, or address..."
                        defaultValue={filters.search || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/properties', { ...filters, search: e.currentTarget.value });
                            }
                        }}
                        className="w-full text-xs border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
                <div>
                    <select
                        defaultValue={filters.status || ''}
                        onChange={(e) => router.get('/admin/properties', { ...filters, status: e.target.value })}
                        className="text-xs border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div>
                    <select
                        defaultValue={filters.listing_type || ''}
                        onChange={(e) => router.get('/admin/properties', { ...filters, listing_type: e.target.value })}
                        className="text-xs border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                    >
                        <option value="">All Listing Types</option>
                        <option value="for_sale">For Sale</option>
                        <option value="for_rent">For Rent</option>
                        <option value="preselling">Pre-Selling</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {properties.data.map((prop) => (
                            <tr key={prop.id} className="hover:bg-gray-50/60 transition">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                            <img
                                                src={prop.images?.[0] || `https://placehold.co/100x100?text=${encodeURIComponent(prop.title)}`}
                                                alt={prop.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-sm">{prop.title}</div>
                                            <div className="text-gray-400 text-[11px]">{prop.bedrooms} Beds · {prop.bathrooms} Baths</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="capitalize text-gray-700 font-medium">
                                        {prop.propertyType.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-indigo-700">
                                    {prop.priceFormatted}
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                    {prop.city}
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={prop.status}
                                        onChange={(e) => handleStatusChange(prop.id, e.target.value)}
                                        className="text-xs font-semibold rounded-lg border-gray-200 p-1 border bg-gray-50"
                                    >
                                        <option value="active">Active</option>
                                        <option value="draft">Draft</option>
                                        <option value="pending">Pending</option>
                                        <option value="sold">Sold</option>
                                        <option value="rented">Rented</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <Link
                                        href={`/admin/properties/${prop.id}/edit`}
                                        className="text-indigo-600 hover:text-indigo-900 font-semibold"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        href={`/properties/${prop.id}`}
                                        className="text-gray-400 hover:text-gray-600 font-medium"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {properties.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No properties found. Click "+ Add New Property" to create one.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
