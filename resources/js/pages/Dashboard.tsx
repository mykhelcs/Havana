import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage<any>().props;

    return (
        <div className="min-h-screen bg-gray-100">
            <Head title="Dashboard" />
            
            <nav className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="font-semibold text-xl text-gray-800">
                    My App
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Hello, {auth?.user?.name}</span>
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="text-sm text-red-600 underline"
                    >
                        Log Out
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        You're logged in!
                    </div>
                </div>
            </div>
        </div>
    );
}
