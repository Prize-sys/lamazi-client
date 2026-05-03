'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, AlertCircle, Loader, Users, Stethoscope } from 'lucide-react';

type Role = 'client' | 'therapist';

export default function SignupPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            phone: formData.phone,
            role: selectedRole,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(err.error || 'Registration failed');
      }

      const data = await res.json();

      if (selectedRole === 'client') {
        // Store token for OTP page
        localStorage.setItem('lamazi_reg_token', data.token);
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        // Redirect therapists to the therapist portal onboarding
        window.location.href = 'http://localhost:3001/onboarding/membership';
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-block bg-gradient-to-br from-blue-600 to-purple-600 text-white text-3xl rounded-2xl px-6 py-3 mb-4 font-bold">
          🧠 Lamazi
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-gray-600">Join our mental health community</p>
      </div>

      {/* Role Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={() => setSelectedRole('client')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedRole === 'client'
              ? 'border-blue-600 bg-blue-50 shadow-lg'
              : 'border-gray-300 bg-white hover:border-blue-300'
          }`}
        >
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
            selectedRole === 'client' ? 'bg-blue-600' : 'bg-gray-200'
          }`}>
            <Users className={`w-7 h-7 ${selectedRole === 'client' ? 'text-white' : 'text-gray-600'}`} />
          </div>
          <h3 className="text-gray-900 font-semibold text-center mb-2">I&apos;m a Client</h3>
          <p className="text-sm text-gray-600 text-center">
            Looking for mental health support and professional therapy
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSelectedRole('therapist')}
          className={`p-6 rounded-xl border-2 transition-all text-left ${
            selectedRole === 'therapist'
              ? 'border-purple-600 bg-purple-50 shadow-lg'
              : 'border-gray-300 bg-white hover:border-purple-300'
          }`}
        >
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${
            selectedRole === 'therapist' ? 'bg-purple-600' : 'bg-gray-200'
          }`}>
            <Stethoscope className={`w-7 h-7 ${selectedRole === 'therapist' ? 'text-white' : 'text-gray-600'}`} />
          </div>
          <h3 className="text-gray-900 font-semibold text-center mb-2">I&apos;m a Therapist</h3>
          <p className="text-sm text-gray-600 text-center">
            Professional therapist ready to help clients
          </p>
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0712345678"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">For M-Pesa payments and notifications</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-1 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <span className="text-blue-600">Terms of Service</span>{' '}
                and{' '}
                <span className="text-blue-600">Privacy Policy</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white py-3 rounded-lg transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium ${
              selectedRole === 'client'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              `Create ${selectedRole === 'client' ? 'Client' : 'Therapist'} Account`
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
