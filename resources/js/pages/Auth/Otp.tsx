import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Otp() {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

   const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post('/otp', {
        preserveScroll: true,
    });
};

    return (
        <div
            className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-cover bg-center"
            style={{ backgroundImage: 'url("/realestate.jpg")' }}
        >
            <Link
                href="/"
                className="absolute top-5 left-6 flex items-center gap-2 text-white/80 text-sm font-semibold hover:text-white transition group z-10"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform inline-block">←</span>
                Back to Home
            </Link>

            <Head title="Enter OTP" />

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-white/30 backdrop-blur-md border border-white/40 shadow-xl overflow-hidden sm:rounded-xl">
                <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Two-Factor Verification</h2>
                <p className="text-sm text-center text-gray-700 mb-6">
                    Enter the 6-digit code sent to your email.
                </p>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="otp" className="block font-medium text-sm text-gray-800">
                            OTP Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={data.otp}
                            className="bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full p-2 border tracking-widest text-center text-lg"
                            autoComplete="one-time-code"
                            onChange={(e) => setData('otp', e.target.value)}
                        />
                        {errors.otp && (
                            <div className="text-red-600 text-sm mt-1">{errors.otp}</div>
                        )}
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            {processing ? 'Verifying…' : 'Verify'}
                        </button>
                    </div>
                </form>

                <div className="mt-4 text-center">
                    <Link
                        href="/login"
                        className="underline text-sm text-gray-800 hover:text-gray-900"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </div>
    );
}