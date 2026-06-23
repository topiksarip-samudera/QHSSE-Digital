'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.forgotPassword(email);
      setSuccess(true);
      if (res.data.data?.resetToken) {
        setResetToken(res.data.data.resetToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a reset link.
          </p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                If the email exists, a password reset link has been sent. Check your inbox.
              </p>
            </div>

            {resetToken && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-xs font-medium text-yellow-800 mb-1">Development Mode — Reset Token:</p>
                <code className="text-xs break-all text-yellow-900">{resetToken}</code>
                <p className="text-xs text-yellow-700 mt-2">
                  Use this token on the <Link href={`/reset-password?token=${resetToken}`} className="underline font-medium">reset password page</Link>.
                </p>
              </div>
            )}

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ← Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@company.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
