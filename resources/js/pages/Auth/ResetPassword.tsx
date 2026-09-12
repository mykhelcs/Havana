import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface ResetPasswordProps {
    email: string;
}

export default function ResetPassword({ email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        otp: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/realestate.jpg")' }}
        >
            <Link
                href="/forgot-password"
                className="absolute top-5 left-6 flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition group z-10"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">←</span>
                Back
            </Link>

            <Head title="Reset Password" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl overflow-hidden sm:rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Reset Password</h2>
                <p className="text-sm text-center text-gray-700 mb-6">
                    Enter the 6-digit code sent to <strong className="text-gray-900">{email}</strong> and your new password.
                </p>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="otp" className="block font-medium text-sm text-gray-800">
                            6-Digit Verification Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={data.otp}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border tracking-widest text-center text-lg"
                            autoComplete="one-time-code"
                            autoFocus
                            onChange={(e) => setData('otp', e.target.value)}
                        />
                        {errors.otp && <div className="text-red-600 text-sm mt-1">{errors.otp}</div>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password" className="block font-medium text-sm text-gray-800">
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="password_confirmation" className="block font-medium text-sm text-gray-800">
                            Confirm New Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        {errors.password_confirmation && (
                            <div className="text-red-600 text-sm mt-1">{errors.password_confirmation}</div>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {processing ? 'Resetting Password…' : 'Reset Password & Log In'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-800 hover:text-gray-900"
                    >
                        Cancel and back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}
