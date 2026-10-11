import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

type PropertyDetail = {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    listingType: string;
    propertyType: string;
    priceCents: number;
    priceFormatted: string;
    currency: string;
    status: string;
    streetAddress: string | null;
    barangay: string | null;
    city: string;
    province: string;
    lotAreaSqm: number | null;
    floorAreaSqm: number | null;
    bedrooms: number;
    bathrooms: number;
    parkingSpaces: number;
    stories: number;
    yearBuilt: number | null;
    furnishing: string;
    amenities: string[];
    images: string[];
};

type Props = {
    property: PropertyDetail;
};

export default function Show({ property }: Props) {
    const { flash } = usePage<any>().props;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        preferred_date: '',
        financing_option: 'bank_loan',
        message: 'Hi, I am interested in this property. Please send me more details or let me know when we can schedule a visit.',
        website: '', // honeypot
    });

    const submitInquiry: FormEventHandler = (e) => {
        e.preventDefault();
        post(`/properties/${property.id}/inquiries`, {
            preserveScroll: true,
            onSuccess: () => reset('message', 'preferred_date'),
        });
    };

    const mainImage = property.images && property.images.length > 0
        ? property.images[0]
        : `https://placehold.co/1200x800?text=${encodeURIComponent(property.title)}`;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            <Head title={`${property.title} - Havana Real Estate`} />

            {/* Navigation Bar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-widest text-gray-900 uppercase">
                        ✦ HAVANA ✦
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/properties" className="text-sm font-semibold text-gray-600 hover:text-indigo-600">
                            Browse Listings
                        </Link>
                        <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-indigo-600">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <Link href="/properties" className="hover:underline">Properties</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium truncate max-w-xs">{property.title}</span>
                </div>

                {/* Hero Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {property.listingType.replace('_', ' ')}
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {property.propertyType.replace('_', ' ')}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full uppercase tracking-wider">
                                {property.status}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{property.title}</h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-1 text-sm sm:text-base">
                            📍 {[property.streetAddress, property.barangay, property.city, property.province].filter(Boolean).join(', ')}
                        </p>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="text-xs uppercase text-gray-500 font-semibold tracking-wider block">Listing Price</span>
                        <span className="text-3xl sm:text-4xl font-black text-indigo-700">{property.priceFormatted}</span>
                    </div>
                </div>

                {/* Main Media Showcase */}
                <div className="rounded-2xl overflow-hidden bg-gray-900 shadow-xl mb-10 max-h-[500px]">
                    <img
                        src={mainImage}
                        alt={property.title}
                        className="w-full h-full object-cover max-h-[500px]"
                    />
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Property Specs & Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Key Specs Grid */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Property Specifications</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.bedrooms}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Bedrooms</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.bathrooms}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Bathrooms</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.floorAreaSqm ? `${property.floorAreaSqm} m²` : 'N/A'}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Floor Area</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.lotAreaSqm ? `${property.lotAreaSqm} m²` : 'N/A'}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Lot Area</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.parkingSpaces}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Parking</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-2xl font-bold text-gray-900">{property.stories}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Stories</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-sm font-bold text-gray-900 capitalize mt-2">{property.furnishing.replace('_', ' ')}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Furnishing</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="block text-sm font-bold text-gray-900 mt-2">{property.yearBuilt || 'Brand New'}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500">Year Built</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">About this Property</h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                                {property.description || 'No detailed description provided for this listing.'}
                            </p>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h2>
                                <div className="flex flex-wrap gap-2">
                                    {property.amenities.map((amenity) => (
                                        <span key={amenity} className="px-3 py-1.5 bg-gray-100 text-gray-800 text-sm font-medium rounded-lg capitalize">
                                            ✓ {amenity.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Inquiry & Schedule Tour Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule a Tour / Inquire</h3>
                            <p className="text-xs text-gray-500 mb-6">Connect directly with licensed real estate specialists.</p>

                            {flash?.success && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
                                    {flash.success}
                                </div>
                            )}

                            <form onSubmit={submitInquiry} className="space-y-4">
                                {/* Honeypot */}
                                <input
                                    type="text"
                                    name="website"
                                    value={data.website}
                                    onChange={(e) => setData('website', e.target.value)}
                                    style={{ display: 'none' }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Your Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. Maria Santos"
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    />
                                    {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="maria@example.com"
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    />
                                    {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Mobile / WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+63 917 000 0000"
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    />
                                    {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Preferred Viewing Date</label>
                                    <input
                                        type="date"
                                        value={data.preferred_date}
                                        onChange={(e) => setData('preferred_date', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    />
                                    {errors.preferred_date && <p className="text-red-600 text-xs mt-1">{errors.preferred_date}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Financing Preference</label>
                                    <select
                                        value={data.financing_option}
                                        onChange={(e) => setData('financing_option', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                    >
                                        <option value="bank_loan">Bank Loan / Financing</option>
                                        <option value="cash">Spot Cash</option>
                                        <option value="pag_ibig">Pag-IBIG Fund</option>
                                        <option value="in_house">In-House Financing</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Questions or Inquiries</label>
                                    <textarea
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                    />
                                    {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all text-sm disabled:opacity-50"
                                >
                                    {processing ? 'Submitting...' : 'Send Inquiry & Schedule Tour'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
