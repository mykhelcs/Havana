import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type InquiryItem = {
    id: string;
    propertyId: string;
    propertyTitle: string | null;
    propertyPriceFormatted: string | null;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    message: string;
    preferredTourDate: string | null;
    financingOption: string | null;
    status: string;
    adminNotes: string | null;
    createdAt: string;
};

type Props = {
    inquiries: {
        data: InquiryItem[];
        total: number;
        currentPage: number;
        lastPage: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
};

export default function Index({ inquiries, filters }: Props) {
    const handleStatusChange = (id: string, newStatus: string) => {
        router.patch(`/admin/inquiries/${id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-yellow-100 text-yellow-800';
            case 'tour_scheduled': return 'bg-purple-100 text-purple-800';
            case 'closed': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout>
            <Head title="Client Inquiries & Tours - Havana Admin" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Client Leads & Inquiries</h1>
                    <p className="text-sm text-gray-500">Manage tour appointments, buyer requests, and follow-ups.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input
                        type="text"
                        placeholder="Search by client name, email, phone, or property..."
                        defaultValue={filters.search || ''}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                router.get('/admin/inquiries', { ...filters, search: e.currentTarget.value });
                            }
                        }}
                        className="w-full text-xs border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                </div>
                <div>
                    <select
                        defaultValue={filters.status || ''}
                        onChange={(e) => router.get('/admin/inquiries', { ...filters, status: e.target.value })}
                        className="text-xs border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="tour_scheduled">Tour Scheduled</option>
                        <option value="closed">Closed Deal</option>
                        <option value="rejected">Rejected / Spam</option>
                    </select>
                </div>
            </div>

            {/* Inquiries Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Tour Date</th>
                            <th className="px-6 py-4">Financing</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inquiries.data.map((inq) => (
                            <tr key={inq.id} className="hover:bg-gray-50/60 transition">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900">{inq.clientName}</div>
                                    <div className="text-gray-500 text-[11px]">{inq.clientEmail}</div>
                                    <div className="text-gray-400 text-[11px]">{inq.clientPhone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-800 line-clamp-1">{inq.propertyTitle || 'Listing'}</div>
                                    <div className="text-indigo-600 font-bold text-[11px]">{inq.propertyPriceFormatted}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {inq.preferredTourDate ? (
                                        <span className="font-medium text-gray-700">{inq.preferredTourDate}</span>
                                    ) : (
                                        <span className="text-gray-400 italic">No date requested</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="capitalize text-gray-600">
                                        {inq.financingOption ? inq.financingOption.replace('_', ' ') : 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={inq.status}
                                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                                        className={`text-xs font-semibold rounded-lg p-1 border uppercase tracking-wider ${getStatusBadge(inq.status)}`}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="tour_scheduled">Tour Scheduled</option>
                                        <option value="closed">Closed Deal</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/inquiries/${inq.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold"
                                    >
                                        Details →
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {inquiries.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                    No client inquiries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
