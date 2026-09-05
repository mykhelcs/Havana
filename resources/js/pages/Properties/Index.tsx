import { Head, Link } from '@inertiajs/react';
import React from 'react';

type Property = {
    id: string;
    title: string;
    price: number; // in cents
    status: string;
    listing_type: string;
    bedrooms: number;
    bathrooms: number;
    lot_area_sqm: number;
    floor_area_sqm: number;
};

type Props = {
    properties: Property[];
    filters: {
        listing_type?: string;
        max_price?: string;
        min_bedrooms?: string;
    };
};

export default function Index({ properties, filters }: Props) {
    const formatPrice = (cents: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(cents / 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
            <Head title="Properties" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Filter Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        {/* Native GET form for vanilla JS submission */}
                        <form method="GET" action="/properties" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                                <select 
                                    name="listing_type" 
                                    defaultValue={filters.listing_type || ''} 
                                    onChange={(e) => e.target.form?.submit()} 
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Any</option>
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (PHP)</label>
                                <input 
                                    type="number" 
                                    name="max_price" 
                                    defaultValue={filters.max_price || ''} 
                                    onBlur={(e) => e.target.form?.submit()} 
                                    onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.form?.submit()}
                                    placeholder="e.g. 5000000" 
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                                <select 
                                    name="min_bedrooms" 
                                    defaultValue={filters.min_bedrooms || ''} 
                                    onChange={(e) => e.target.form?.submit()} 
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Any</option>
                                    <option value="1">1+</option>
                                    <option value="2">2+</option>
                                    <option value="3">3+</option>
                                    <option value="4">4+</option>
                                </select>
                            </div>

                            <noscript>
                                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Apply</button>
                            </noscript>
                        </form>
                    </aside>

                    {/* Properties Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <div key={property.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                    <div className="aspect-w-16 aspect-h-10 bg-gray-200">
                                        <img 
                                            src={`https://placehold.co/600x400?text=${encodeURIComponent(property.title)}`} 
                                            alt={property.title} 
                                            loading="lazy" 
                                            className="object-cover w-full h-48"
                                        />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{property.title}</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.listing_type === 'sale' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {property.listing_type.charAt(0).toUpperCase() + property.listing_type.slice(1)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-2xl font-bold text-indigo-600 mb-4">
                                            {formatPrice(property.price)}
                                        </p>
                                        
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-1 flex-1">
                                            Philippines {/* Placeholder location */}
                                        </p>

                                        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-auto">
                                            <div className="text-center">
                                                <span className="block text-gray-500 text-xs uppercase tracking-wider">Beds</span>
                                                <span className="block font-semibold text-gray-900">{property.bedrooms}</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-gray-500 text-xs uppercase tracking-wider">Baths</span>
                                                <span className="block font-semibold text-gray-900">{property.bathrooms}</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-gray-500 text-xs uppercase tracking-wider">Floor</span>
                                                <span className="block font-semibold text-gray-900">{property.floor_area_sqm}m²</span>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Link href={`/properties/${property.id}`} className="block w-full text-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium text-sm transition-colors">
                                                View details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {properties.length === 0 && (
                                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                                    No properties found matching your criteria.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

