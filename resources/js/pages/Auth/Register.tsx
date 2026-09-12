import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const hasMinLength = data.password.length >= 8;
    const hasMixedCase = /[a-z]/.test(data.password) && /[A-Z]/.test(data.password);
    const hasNumber = /[0-9]/.test(data.password);
    const hasSymbol = /[^A-Za-z0-9]/.test(data.password);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
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
            <Head title="Register" />
            
            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl overflow-hidden sm:rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="name" className="block font-medium text-sm text-gray-800">Name</label>
                        <input
                            id="name"
                            name="name"
                            value={data.name}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="name"
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="email" className="block font-medium text-sm text-gray-800">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}

                        <div className="mt-2 p-3 bg-amber-50/80 border border-amber-300/70 rounded-lg text-xs shadow-sm backdrop-blur-sm">
                            <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1.5">
                                <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Password must contain:</span>
                            </div>
                            <ul className="space-y-1 pl-1">
                                <li className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                                    <span className={hasMinLength ? 'text-emerald-600 font-bold' : 'text-amber-500'}>
                                        {hasMinLength ? '✓' : '•'}
                                    </span>
                                    <span>At least 8 characters</span>
                                </li>
                                <li className={`flex items-center gap-1.5 transition-colors ${hasMixedCase ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                                    <span className={hasMixedCase ? 'text-emerald-600 font-bold' : 'text-amber-500'}>
                                        {hasMixedCase ? '✓' : '•'}
                                    </span>
                                    <span>Uppercase and lowercase letters</span>
                                </li>
                                <li className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                                    <span className={hasNumber ? 'text-emerald-600 font-bold' : 'text-amber-500'}>
                                        {hasNumber ? '✓' : '•'}
                                    </span>
                                    <span>At least one number</span>
                                </li>
                                <li className={`flex items-center gap-1.5 transition-colors ${hasSymbol ? 'text-emerald-700 font-medium' : 'text-gray-700'}`}>
                                    <span className={hasSymbol ? 'text-emerald-600 font-bold' : 'text-amber-500'}>
                                        {hasSymbol ? '✓' : '•'}
                                    </span>
                                    <span>At least one special symbol (!@#$%^&*)</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-800">Confirm Password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        {errors.password_confirmation && <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Link
                            href="/login"
                            className="underline text-sm text-gray-800 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Already registered?
                        </Link>

                        <button className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ms-4" disabled={processing}>
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
