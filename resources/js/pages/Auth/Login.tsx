import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div 
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/realestate.jpg")' }}
        >
            {/* Back to Home — floating top-left corner */}
            <Link
                href="/"
                className="absolute top-5 left-6 flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition group z-10"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">←</span>
                Back to Home
            </Link>
            <Head title="Log in" />
            
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl overflow-hidden sm:rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className="block font-medium text-sm text-gray-800">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block font-medium text-sm text-gray-800">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <span className="ms-2 text-sm text-gray-800">Remember me</span>
                        </label>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Link
                            href="/register"
                            className="underline text-sm text-gray-800 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Need an account? Register
                        </Link>

                        <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ms-4" disabled={processing}>
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
