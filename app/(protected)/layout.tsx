'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Home, Calendar, History, AlertCircle, User, Bell, MessageSquare, Shield } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/discover',      icon: Home,          label: 'Home' },
  { href: '/bookings',      icon: Calendar,      label: 'Bookings' },
  { href: '/history',       icon: History,       label: 'History' },
  { href: '/notifications', icon: Bell,          label: 'Alerts' },
  { href: '/emergency',     icon: AlertCircle,   label: 'Help',  danger: true },
];

const PROFILE_LINKS = [
  { href: '/profile',  icon: User,           label: 'Profile' },
  { href: '/disputes', icon: MessageSquare,  label: 'Disputes' },
  { href: '/consent',  icon: Shield,         label: 'Agreements' },
];

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <Link href="/discover" className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <div>
                <h1 className="text-lg font-bold text-blue-600 leading-none">MindCare</h1>
                <p className="text-xs text-gray-400">Your journey to wellness</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Link
                href="/notifications"
                className={`p-2 rounded-lg transition-colors hidden sm:block ${
                  pathname === '/notifications' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Bell className="w-5 h-5" />
              </Link>

              {/* Emergency */}
              <Link
                href="/emergency"
                className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-200 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Emergency</span>
              </Link>

              {/* Profile dropdown */}
              <div className="relative group">
                <button className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2">
                  {user?.full_name?.charAt(0) || 'U'}
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-200 shadow-xl py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-150 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                  </div>
                  {PROFILE_LINKS.map(({ href, icon: Icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                        pathname === href
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-10">
        {children}
      </main>

      {/* Bottom Navigation — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50 lg:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-2.5">
            {NAV_ITEMS.map(({ href, icon: Icon, label, danger }) => {
              const isActive = pathname === href ||
                (href !== '/discover' && pathname.startsWith(href + '/'));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                    danger
                      ? isActive ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      : isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
