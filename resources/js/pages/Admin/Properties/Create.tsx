import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        listing_type: 'for_sale',
        property_type: 'house_and_lot',
        price: '',
        status: 'active',
        street_address: '',
        barangay: '',
        city: 'Cebu City',
        province: 'Cebu',
        lot_area_sqm: '',
        floor_area_sqm: '',
        bedrooms: 3,
        bathrooms: 2,
        parking_spaces: 1,
        stories: 2,
        year_built: new Date().getFullYear(),
        furnishing: 'unfurnished',
        amenities: [] as string[],
        is_featured: false,
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
        post('/admin/properties');
    };

    return (
        <AdminLayout>
            <Head title="Create Property Listing - Havana Admin" />

            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Create New Property</h1>
                        <p className="text-xs text-gray-500">Add a new real estate listing to the Havana catalog.</p>
                    </div>
                    <Link
                        href="/admin/properties"
                        className="text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900"
                    >
                        &larr; Back to Listings
                    </Link>
                </div>

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
                                placeholder="e.g. Modern Minimalist House & Lot with Swimming Pool"
                                className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                            {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                    placeholder="e.g. 8500000"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Description</label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the layout, neighborhood, unique features..."
                                className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                            />
                        </div>
                    </div>

                    {/* Location Info */}
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
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Barangay / District</label>
                                <input
                                    type="text"
                                    value={data.barangay}
                                    onChange={(e) => setData('barangay', e.target.value)}
                                    placeholder="e.g. Lahug"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={data.street_address}
                                    onChange={(e) => setData('street_address', e.target.value)}
                                    placeholder="e.g. Phase 2, Block 4, Lot 10"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Physical Specs */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">3. Specifications</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Bedrooms *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={data.bedrooms}
                                    onChange={(e) => setData('bedrooms', parseInt(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Bathrooms *</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={data.bathrooms}
                                    onChange={(e) => setData('bathrooms', parseInt(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Lot Area (m²)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.lot_area_sqm}
                                    onChange={(e) => setData('lot_area_sqm', e.target.value)}
                                    placeholder="e.g. 250"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Floor Area (m²)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.floor_area_sqm}
                                    onChange={(e) => setData('floor_area_sqm', e.target.value)}
                                    placeholder="e.g. 180"
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Parking Spaces</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.parking_spaces}
                                    onChange={(e) => setData('parking_spaces', parseInt(e.target.value) || 0)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Furnishing</label>
                                <select
                                    value={data.furnishing}
                                    onChange={(e) => setData('furnishing', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white"
                                >
                                    <option value="unfurnished">Unfurnished / Bare</option>
                                    <option value="semi_furnished">Semi-Furnished</option>
                                    <option value="fully_furnished">Fully Furnished</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Featured on Homepage?</label>
                                <div className="mt-2 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <label htmlFor="is_featured" className="ml-2 text-xs text-gray-700 font-medium">Show in featured showcase</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Amenities Checkboxes */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">4. Amenities & Features</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {availableAmenities.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.amenities.includes(amenity)}
                                        onChange={() => toggleAmenity(amenity)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span className="capitalize">{amenity.replace(/_/g, ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold uppercase tracking-wider text-indigo-700 border-b pb-2">5. Photo Gallery</h2>
                        <div>
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
                            <p className="text-[11px] text-gray-400 mt-1">JPEG, PNG, or WebP up to 5MB each. First image becomes primary thumbnail.</p>
                        </div>
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
                            {processing ? 'Saving...' : 'Publish Property Listing'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
