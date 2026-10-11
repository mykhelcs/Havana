import { Head, Link } from '@inertiajs/react';
import React from 'react';

type Property = {
    id: string;
    title: string;
    priceCents?: number;
    price?: number;
    priceFormatted?: string;
    status: string;
    listingType?: string;
    listing_type?: string;
    propertyType?: string;
    bedrooms: number;
    bathrooms: number;
    lotAreaSqm?: number | null;
    floorAreaSqm?: number | null;
    city?: string;
    province?: string;
    images?: string[];
};

type Props = {
    properties: {
        data: Property[];
        total: number;
        currentPage: number;
        lastPage: number;
    } | Property[];
    filters: {
        listing_type?: string;
        property_type?: string;
        max_price?: string;
        min_bedrooms?: string;
        city?: string;
        search?: string;
    };
};

export default function Index({ properties, filters }: Props) {
    const list: Property[] = Array.isArray(properties) ? properties : (properties?.data || []);

    const formatPrice = (cents?: number) => {
        if (!cents) return 'PHP 0.00';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(cents / 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            <Head title="Properties - Havana Real Estate" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-widest text-gray-900 uppercase">
                        ✦ HAVANA ✦
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link href="/properties" className="text-sm font-semibold text-indigo-600">
                            Browse Listings
                        </Link>
                        <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-indigo-600">
                            Dashboard
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Explore Properties</h1>
                    <p className="text-gray-500 text-sm mt-1">Discover houses, condominiums, and premium land across the Philippines.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <form method="GET" action="/properties" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                            <div>
                                <h2 className="text-base font-bold text-gray-800">Filter Listings</h2>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Listing Type</label>
                                <select
                                    name="listing_type"
                                    defaultValue={filters.listing_type || ''}
                                    onChange={(e) => e.target.form?.submit()}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                                >
                                    <option value="">Any</option>
                                    <option value="for_sale">For Sale</option>
                                    <option value="for_rent">For Rent</option>
                                    <option value="preselling">Pre-Selling</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Property Type</label>
                                <select
                                    name="property_type"
                                    defaultValue={filters.property_type || ''}
                                    onChange={(e) => e.target.form?.submit()}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                                >
                                    <option value="">Any</option>
                                    <option value="house_and_lot">House & Lot</option>
                                    <option value="condominium">Condominium</option>
                                    <option value="townhouse">Townhouse</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land_lot">Land / Lot</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Max Price (PHP)</label>
                                <input
                                    type="number"
                                    name="max_price"
                                    defaultValue={filters.max_price || ''}
                                    onBlur={(e) => e.target.form?.submit()}
                                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.form?.submit()}
                                    placeholder="e.g. 5000000"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">Min Bedrooms</label>
                                <select
                                    name="min_bedrooms"
                                    defaultValue={filters.min_bedrooms || ''}
                                    onChange={(e) => e.target.form?.submit()}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                                >
                                    <option value="">Any</option>
                                    <option value="1">1+ Beds</option>
                                    <option value="2">2+ Beds</option>
                                    <option value="3">3+ Beds</option>
                                    <option value="4">4+ Beds</option>
                                </select>
                            </div>

                            <noscript>
                                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 text-sm font-semibold">Apply Filters</button>
                            </noscript>
                        </form>
                    </aside>

                    {/* Properties Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {list.map((property) => {
                                const listingBadge = (property.listingType || property.listing_type || 'for_sale').replace('_', ' ');
                                const priceVal = property.priceCents || property.price || 0;
                                const img = property.images && property.images.length > 0
                                    ? property.images[0]
                                    : `https://placehold.co/600x400?text=${encodeURIComponent(property.title)}`;

                                return (
                                    <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-all">
                                        <div className="h-48 bg-gray-200 overflow-hidden relative">
                                            <img
                                                src={img}
                                                alt={property.title}
                                                loading="lazy"
                                                className="object-cover w-full h-full hover:scale-105 transition duration-300"
                                            />
                                            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm">
                                                {listingBadge}
                                            </span>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col">
                                            <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1">{property.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1 mb-3">
                                                📍 {property.city || 'Philippines'} {property.province ? `, ${property.province}` : ''}
                                            </p>

                                            <p className="text-xl font-black text-indigo-700 mb-4">
                                                {property.priceFormatted || formatPrice(priceVal)}
                                            </p>

                                            <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-100 mt-auto text-center">
                                                <div>
                                                    <span className="block text-gray-400 text-[10px] uppercase tracking-wider">Beds</span>
                                                    <span className="block font-bold text-gray-800 text-sm">{property.bedrooms}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-400 text-[10px] uppercase tracking-wider">Baths</span>
                                                    <span className="block font-bold text-gray-800 text-sm">{property.bathrooms}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-400 text-[10px] uppercase tracking-wider">Floor</span>
                                                    <span className="block font-bold text-gray-800 text-sm">{property.floorAreaSqm ? `${property.floorAreaSqm}m²` : 'N/A'}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <Link
                                                    href={`/properties/${property.id}`}
                                                    className="block w-full text-center bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 font-semibold text-xs tracking-wider uppercase transition-colors"
                                                >
                                                    View Details & Schedule
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {list.length === 0 && (
                                <div className="col-span-full py-16 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-lg font-medium text-gray-700 mb-1">No listings found matching your criteria</p>
                                    <p className="text-sm text-gray-400">Try adjusting your filters or price range.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
