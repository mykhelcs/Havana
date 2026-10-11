import React, { FormEventHandler } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

type Props = {
    property: {
        id: string;
        title: string;
        description: string | null;
        listingType: string;
        propertyType: string;
        priceCents: number;
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
        isFeatured: boolean;
        images: string[];
    };
};

export default function Edit({ property }: Props) {
    const { flash } = usePage<any>().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: property.title,
        description: property.description || '',
        listing_type: property.listingType,
        property_type: property.propertyType,
        price: (property.priceCents / 100).toString(),
        status: property.status,
        street_address: property.streetAddress || '',
        barangay: property.barangay || '',
        city: property.city,
        province: property.province,
        lot_area_sqm: property.lotAreaSqm?.toString() || '',
        floor_area_sqm: property.floorAreaSqm?.toString() || '',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parking_spaces: property.parkingSpaces,
        stories: property.stories,
        year_built: property.yearBuilt || '',
        furnishing: property.furnishing,
        amenities: property.amenities || [],
        is_featured: property.isFeatured,
        images: [] as File[],
    });

    const availableAmenities = [
        'swimming_pool', '24_7_security', 'clubhouse', 'fitness_gym',
        'balcony', 'pet_friendly', 'maid_room', 'generator_backup',
        'fiber_internet', 'gated_community'
    ];

    const toggleAmenity = (item: string) => {
        if (data.amenities.includes(item)) {
            setData('amenities', data.amenities.filter((a) => a !== item));
        } else {
            setData('amenities', [...data.amenities, item]);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Use POST with _method=PUT to support multipart file upload in Laravel
        post(`/admin/properties/${property.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Edit ${property.title} - Havana Admin`} />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Edit Property</h1>
                        <p className="text-xs text-gray-500">Updating #{property.id.slice(0, 8)}</p>
                    </div>
                    <Link
                        href="/admin/properties"
                        className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900"
                    >
                        &larr; Back to Listings
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">1. Basic Details</h2>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Listing Title *</label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Status *</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="pending">Pending</option>
                                    <option value="sold">Sold</option>
                                    <option value="rented">Rented</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Listing Type *</label>
                                <select
                                    value={data.listing_type}
                                    onChange={(e) => setData('listing_type', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                >
                                    <option value="for_sale">For Sale</option>
                                    <option value="for_rent">For Rent</option>
                                    <option value="preselling">Pre-Selling</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Property Type *</label>
                                <select
                                    value={data.property_type}
                                    onChange={(e) => setData('property_type', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                >
                                    <option value="house_and_lot">House & Lot</option>
                                    <option value="condominium">Condominium</option>
                                    <option value="townhouse">Townhouse</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land_lot">Land / Lot</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (PHP) *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description</label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">2. Location</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Province *</label>
                                <input
                                    type="text"
                                    required
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Barangay</label>
                                <input
                                    type="text"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={data.street_address}
                                    onChange={(e) => setData('street_address', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Existing Images */}
                    {property.images && property.images.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">3. Current Photos</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {property.images.map((img, idx) => (
                                    <div key={idx} className="h-28 rounded-xl overflow-hidden bg-gray-100 border">
                                        <img src={img} alt="Property" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add More Images */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">4. Add More Photos</h2>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setData('images', Array.from(e.target.files));
                                }
                            }}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link
                            href="/admin/properties"
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
