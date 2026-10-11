import React, { FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Props = {
    inquiry: {
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
};

export default function Show({ inquiry }: Props) {
    const { flash } = usePage<any>().props;

    const { data, setData, patch, processing } = useForm({
        status: inquiry.status,
        admin_notes: inquiry.adminNotes || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/admin/inquiries/${inquiry.id}/status`);
    };

    return (
        <AdminLayout>
            <Head title={`Inquiry from ${inquiry.clientName} - Havana Admin`} />

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Inquiry & Tour Request</h1>
                        <p className="text-xs text-gray-500">Lead ID #{inquiry.id.slice(0, 8)}</p>
                    </div>
                    <Link
                        href="/admin/inquiries"
                        className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900"
                    >
                        &larr; Back to Inquiries
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Client & Property Overview */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2 mb-4">Client Contact Info</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Client Name</span>
                                <span className="font-bold text-gray-900 text-sm">{inquiry.clientName}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Email</span>
                                <a href={`mailto:${inquiry.clientEmail}`} className="font-semibold text-indigo-600 hover:underline text-sm">{inquiry.clientEmail}</a>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Phone / WhatsApp</span>
                                <a href={`tel:${inquiry.clientPhone}`} className="font-semibold text-indigo-600 hover:underline text-sm">{inquiry.clientPhone}</a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2 mb-4">Listing Inquired About</h2>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{inquiry.propertyTitle || 'Property'}</h3>
                                <p className="text-sm text-indigo-700 font-bold">{inquiry.propertyPriceFormatted}</p>
                            </div>
                            <Link
                                href={`/properties/${inquiry.propertyId}`}
                                className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition"
                            >
                                View Listing
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2 mb-4">Tour & Buyer Request Details</h2>
                        <div className="space-y-3">
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Preferred Tour Date</span>
                                <span className="text-sm font-bold text-gray-800">{inquiry.preferredTourDate || 'Not specified by client'}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Financing Preference</span>
                                <span className="text-sm font-bold text-gray-800 capitalize">{inquiry.financingOption ? inquiry.financingOption.replace('_', ' ') : 'Not specified'}</span>
                            </div>
                            <div>
                                <span className="block text-xs uppercase text-gray-400 font-semibold">Client Inquiry Message</span>
                                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl mt-1 leading-relaxed italic">
                                    "{inquiry.message}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agent Status & Action Form */}
                    <form onSubmit={submit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">Agent Status & Internal Notes</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Pipeline Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                >
                                    <option value="new">New Inquiry</option>
                                    <option value="contacted">Client Contacted</option>
                                    <option value="tour_scheduled">Viewing / Tour Scheduled</option>
                                    <option value="closed">Deal Closed / Reserved</option>
                                    <option value="rejected">Rejected / Spam</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Internal Notes & Meeting Summary</label>
                            <textarea
                                rows={3}
                                value={data.admin_notes}
                                onChange={(e) => setData('admin_notes', e.target.value)}
                                placeholder="Add notes on tour feedback, agreed visit times, bank pre-approval..."
                                className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Lead Status & Notes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
