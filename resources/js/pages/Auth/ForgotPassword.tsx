import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/realestate.jpg")' }}
        >
            {/* Back to Login — floating top-left corner */}
            <Link
                href="/login"
                className="absolute top-5 left-6 flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition group z-10"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">←</span>
                Back to Login
            </Link>
            <Head title="Forgot Password" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl overflow-hidden sm:rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Forgot Password</h2>

                <p className="mb-6 text-sm text-gray-800 text-center leading-relaxed">
                    Enter your email address and we will send you a 6-digit verification code to reset your password.
                </p>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className="block font-medium text-sm text-gray-800">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Link
                            href="/login"
                            className="underline text-sm text-gray-800 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Remember password? Login
                        </Link>

                        <button
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                            disabled={processing}
                        >
                            Send Code
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
