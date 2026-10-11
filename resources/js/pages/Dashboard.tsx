import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

type InquiryItem = {
    id: string;
    propertyId: string;
    propertyTitle: string | null;
    propertyPriceFormatted: string | null;
    message: string;
    preferredTourDate: string | null;
    financingOption: string | null;
    status: string;
    adminNotes: string | null;
    createdAt: string;
};

type SavedPropertyItem = {
    id: string;
    title: string;
    priceFormatted: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    images: string[];
};

type Props = {
    inquiries?: InquiryItem[];
    savedProperties?: SavedPropertyItem[];
};

export default function Dashboard({ inquiries = [], savedProperties = [] }: Props) {
    const { auth, flash } = usePage<any>().props;
    const [activeTab, setActiveTab] = useState<'inquiries' | 'saved'>('inquiries');

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'contacted':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'tour_scheduled':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'closed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            <Head title="Client Portal - Havana Real Estate" />

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-widest text-gray-900 uppercase">
                        ✦ HAVANA ✦
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/properties" className="text-sm font-semibold text-gray-700 hover:text-indigo-600">
                            Browse Listings
                        </Link>
                        {auth?.user?.user_role === 'admin' && (
                            <Link href="/admin" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                                Admin Dashboard
                            </Link>
                        )}
                        <span className="text-sm text-gray-500">
                            {auth?.user?.name || auth?.user?.email}
                        </span>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="text-xs font-semibold px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                            Sign Out
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Profile Banner */}
                <div className="bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="text-xs uppercase tracking-widest text-yellow-400 font-bold">Client Portal</span>
                        <h1 className="text-3xl font-extrabold mt-1">Welcome back, {auth?.user?.name || 'Home Seeker'}!</h1>
                        <p className="text-gray-300 text-sm mt-1">Track your property viewing appointments and saved homes in one place.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/properties"
                            className="px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl text-sm hover:bg-yellow-300 transition shadow"
                        >
                            Explore More Homes
                        </Link>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('inquiries')}
                        className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'inquiries'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span>My Inquiries & Scheduled Tours</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">{inquiries.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`pb-4 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                            activeTab === 'saved'
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span>Saved Properties</span>
                        <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">{savedProperties.length}</span>
                    </button>
                </div>

                {/* Content: Inquiries Tab */}
                {activeTab === 'inquiries' && (
                    <div className="space-y-4">
                        {inquiries.map((inq) => (
                            <div key={inq.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {inq.propertyTitle || 'Property Listing'}
                                        </h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusBadge(inq.status)}`}>
                                            {inq.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        <strong className="text-gray-800">Your Message:</strong> "{inq.message}"
                                    </p>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                                        {inq.preferredTourDate && (
                                            <span>📅 Requested Tour Date: <strong className="text-gray-700">{inq.preferredTourDate}</strong></span>
                                        )}
                                        {inq.financingOption && (
                                            <span>💳 Financing: <strong className="text-gray-700 capitalize">{inq.financingOption.replace('_', ' ')}</strong></span>
                                        )}
                                        <span>🕒 Submitted: {new Date(inq.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {inq.adminNotes && (
                                        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-900">
                                            <strong>Agent Note:</strong> {inq.adminNotes}
                                        </div>
                                    )}
                                </div>

                                <div className="shrink-0 flex items-center gap-3">
                                    <Link
                                        href={`/properties/${inq.propertyId}`}
                                        className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition"
                                    >
                                        View Listing
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {inquiries.length === 0 && (
                            <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-base font-bold text-gray-800 mb-1">No inquiries submitted yet</p>
                                <p className="text-sm text-gray-500 mb-4">Find a property you love and schedule an in-person viewing!</p>
                                <Link
                                    href="/properties"
                                    className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs shadow hover:bg-indigo-700 transition"
                                >
                                    Browse Properties
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Content: Saved Tab */}
                {activeTab === 'saved' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedProperties.map((prop) => (
                            <div key={prop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                                <div className="h-44 bg-gray-200">
                                    <img
                                        src={prop.images?.[0] || `https://placehold.co/600x400?text=${encodeURIComponent(prop.title)}`}
                                        alt={prop.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 text-base">{prop.title}</h3>
                                    <p className="text-xs text-gray-500 mt-1 mb-2">📍 {prop.city}</p>
                                    <p className="text-lg font-black text-indigo-700 mb-4">{prop.priceFormatted}</p>

                                    <div className="mt-auto flex gap-2">
                                        <Link
                                            href={`/properties/${prop.id}`}
                                            className="flex-1 text-center py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold hover:bg-gray-800 transition"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/properties/${prop.id}/save`}
                                            method="post"
                                            as="button"
                                            className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                                        >
                                            Remove
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {savedProperties.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                                <p className="text-base font-bold text-gray-800 mb-1">You haven't saved any listings yet</p>
                                <p className="text-sm text-gray-500 mb-4">Bookmark homes while exploring to compare them later.</p>
                                <Link
                                    href="/properties"
                                    className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-xs shadow hover:bg-indigo-700 transition"
                                >
                                    Explore Properties
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
