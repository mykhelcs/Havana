import { Head, Link } from '@inertiajs/react';

// --- STATIC PLACEHOLDER DATA (swap for DB data in Option B) ---

const defaultFeaturedProperties = [
    { id: '1', title: 'Modern Villa',     location: 'Cebu City',   price: '₱4,200,000', beds: 4, baths: 3, type: 'House',      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600' },
    { id: '2', title: 'Studio Loft',      location: 'BGC, Taguig', price: '₱1,800,000', beds: 1, baths: 1, type: 'Condo',      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600' },
    { id: '3', title: 'Family Home',      location: 'Davao City',  price: '₱3,500,000', beds: 3, baths: 2, type: 'House',      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600' },
];

const testimonials = [
    { name: 'Maria Santos',   location: 'Cebu City',   quote: 'Havana found us our dream home in just 3 weeks. The team was professional and genuinely cared about our needs.',  rating: 5 },
    { name: 'Juan dela Cruz', location: 'BGC, Taguig', quote: 'I listed my condo through Havana and sold it above asking price. Incredible service from start to finish.',         rating: 5 },
    { name: 'Ana Reyes',      location: 'Davao',       quote: "As a first-time buyer, I was nervous. Havana walked me through every step. I couldn't be happier with my home.", rating: 5 },
];

const categories = [
    { label: 'House',      type: 'house_and_lot', icon: '🏡' },
    { label: 'Condo',      type: 'condominium',   icon: '🏢' },
    { label: 'Commercial', type: 'commercial',    icon: '🏗️' },
    { label: 'Land',       type: 'land_lot',      icon: '🌿' },
];

const stats = [
    { label: 'Active Listings',  value: '500+' },
    { label: 'Happy Clients',    value: '1,200+' },
    { label: 'Years Experience', value: '10+' },
    { label: 'Cities Covered',   value: '25+' },
];

type Props = {
    featuredProperties?: any[];
};

export default function Welcome({ featuredProperties = [] }: Props) {
    const displayListings = featuredProperties.length > 0
        ? featuredProperties.map((p) => ({
            id: p.id,
            title: p.title,
            location: `${p.city || 'Philippines'}${p.province ? ', ' + p.province : ''}`,
            price: p.priceFormatted,
            beds: p.bedrooms,
            baths: p.bathrooms,
            type: (p.propertyType || 'Property').replace('_', ' '),
            image: p.images?.[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
        }))
        : defaultFeaturedProperties;

    return (
        <div className="min-h-screen flex flex-col">
            <Head title="Havana Real Estate - Find Your Dream Home in the Philippines" />

            {/* HERO SECTION */}
            <div
                className="relative min-h-screen bg-cover bg-center flex flex-col"
                style={{ backgroundImage: 'url("/realestate.jpg")' }}
            >
                <div className="absolute inset-0 bg-black/40" />

                <div className="relative flex flex-col min-h-screen">
                    {/* Glassmorphism Navbar */}
                    <nav className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 px-8 py-4">
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-8">
                                <Link href="/" className="text-white text-sm font-semibold tracking-widest uppercase hover:text-yellow-300 transition">
                                    Home
                                </Link>
                                <Link href="/properties" className="text-white/80 text-sm font-semibold tracking-widest uppercase hover:text-white transition">
                                    Properties
                                </Link>
                            </div>

                            <span className="text-white text-2xl font-bold tracking-[0.3em] uppercase">
                                ✦ HAVANA ✦
                            </span>

                            <div className="flex items-center gap-8">
                                <Link href="/dashboard" className="text-white/80 text-sm font-semibold tracking-widest uppercase hover:text-white transition">
                                    Dashboard
                                </Link>
                                <Link href="/login" className="text-white/80 text-sm font-semibold tracking-widest uppercase hover:text-white transition">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* Hero Content */}
                    <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h1 className="text-white text-6xl lg:text-8xl font-bold tracking-widest uppercase drop-shadow-lg">
                            HAVANA
                        </h1>
                        <p className="text-yellow-300 text-xl lg:text-2xl font-light tracking-widest uppercase mt-2">
                            Real Estate Philippines
                        </p>
                        <p className="text-white/80 text-lg mt-6 italic max-w-md">
                            "Find Your Place in the World."
                        </p>

                        {/* Search Bar */}
                        <form action="/properties" method="GET" className="mt-8 w-full max-w-xl">
                            <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-5 py-3 shadow-xl">
                                <span className="text-gray-400 mr-3 text-lg">🔍</span>
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search by location, city, or property type..."
                                    className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-sm"
                                />
                                <button type="submit" className="ml-3 bg-yellow-400 text-gray-900 px-5 py-1.5 rounded-full text-sm font-bold hover:bg-yellow-300 transition">
                                    Search
                                </button>
                            </div>
                        </form>

                        <Link
                            href="/properties"
                            className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 text-sm font-bold uppercase tracking-widest rounded-full hover:bg-yellow-300 transition shadow-lg"
                        >
                            Explore Properties
                        </Link>
                    </main>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════
                STATS BAR — trust indicators
            ═══════════════════════════════════════════════ */}
            <section className="bg-gray-900 py-10 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                    {stats.map(stat => (
                        <div key={stat.label}>
                            <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
                            <p className="text-gray-400 text-sm uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                BROWSE BY CATEGORY
            ═══════════════════════════════════════════════ */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Browse by Category</h2>
                    <p className="text-gray-500 text-sm mb-8">Find exactly what you're looking for</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat.label}
                                className="flex flex-col items-center gap-2 px-10 py-5 bg-white rounded-xl shadow hover:shadow-md hover:bg-yellow-50 transition border border-gray-100 cursor-pointer"
                            >
                                <span className="text-3xl">{cat.icon}</span>
                                <span className="text-sm font-semibold text-gray-700">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                FEATURED PROPERTIES — 6-card grid
            ═══════════════════════════════════════════════ */}
            <section className="py-16 bg-gray-100">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Featured Properties</h2>
                    <p className="text-gray-500 text-sm mb-10 text-center">Handpicked listings just for you</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayListings.map(prop => (
                            <div key={prop.id} className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition group">
                                {/* Property image */}
                                <div className="overflow-hidden h-48 bg-gray-200">
                                    <img
                                        src={prop.image}
                                        alt={prop.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>

                                <div className="p-4">
                                    {/* Type badge */}
                                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold uppercase">
                                        {prop.type}
                                    </span>

                                    {/* Title & Location */}
                                    <h3 className="font-bold text-gray-800 mt-2 line-clamp-1">{prop.title}</h3>
                                    <p className="text-gray-500 text-sm">📍 {prop.location}</p>

                                    {/* Beds / Baths */}
                                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                                        {prop.beds > 0 && <span>🛏 {prop.beds} Beds</span>}
                                        {prop.baths > 0 && <span>🚿 {prop.baths} Baths</span>}
                                    </div>

                                    {/* Price + CTA */}
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-lg font-bold text-indigo-700">{prop.price}</span>
                                        <Link href={`/properties/${prop.id}`} className="text-sm text-yellow-600 font-semibold hover:underline">
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                TESTIMONIALS — 3 client quotes
            ═══════════════════════════════════════════════ */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">What Our Clients Say</h2>
                    <p className="text-gray-500 text-sm mb-10">Real stories from real homeowners</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map(t => (
                            <div key={t.name} className="bg-gray-50 rounded-2xl p-6 text-left shadow-sm border border-gray-100">
                                {/* Star rating */}
                                <p className="text-yellow-400 text-lg mb-3">{'⭐'.repeat(t.rating)}</p>

                                {/* Quote */}
                                <p className="text-gray-700 italic text-sm leading-relaxed">"{t.quote}"</p>

                                {/* Attribution */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                                    <p className="text-gray-400 text-xs">{t.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════════════ */}
            <footer className="bg-gray-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div>
                        <h3 className="text-xl font-bold tracking-widest uppercase mb-3">✦ HAVANA</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Real Estate · Finding your place in the world, one home at a time.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-300 uppercase text-xs tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/"        className="hover:text-white transition">Home</Link></li>
                            <li><Link href="/explore" className="hover:text-white transition">Explore Properties</Link></li>
                            <li><Link href="/about"   className="hover:text-white transition">About Us</Link></li>
                            <li><Link href="/login"   className="hover:text-white transition">Login</Link></li>
                            <li><Link href="/register" className="hover:text-white transition">Register</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-300 uppercase text-xs tracking-wider">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>📧 hello@havana.ph</li>
                            <li>📞 +63 917 000 0000</li>
                            <li>📍 Cebu City, Philippines</li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-600 text-xs mt-10 border-t border-gray-800 pt-6">
                    © 2026 Havana Real Estate. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
