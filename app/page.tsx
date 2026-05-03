import Link from 'next/link';
import { Brain, Shield, Video, Clock, Heart, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Verified Therapists',
      description: 'All therapists are licensed professionals with verified credentials',
    },
    {
      icon: Video,
      title: 'Online Sessions',
      description: 'Secure video sessions via Google Meet from anywhere',
    },
    {
      icon: Clock,
      title: 'Flexible Booking',
      description: 'Book sessions that fit your schedule with easy rescheduling',
    },
    {
      icon: Heart,
      title: 'Privacy Focused',
      description: 'Your conversations and data are completely confidential',
    },
  ];

  const stats = [
    { number: '500+', label: 'Verified Therapists' },
    { number: '10,000+', label: 'Sessions Completed' },
    { number: '4.9/5', label: 'Average Rating' },
    { number: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-semibold text-gray-900">Lamazi</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 text-sm font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Professional Mental Health Support,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Anytime
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with verified therapists in Kenya for secure, private online sessions.
                Find the right support for your mental health journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl flex items-center gap-2 text-lg font-medium"
                >
                  Find a Therapist
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/signup?role=therapist"
                  className="bg-white text-gray-900 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all border-2 border-gray-200 flex items-center gap-2 text-lg font-medium"
                >
                  I&apos;m a Therapist
                </Link>
              </div>
            </div>
            {/* Demo Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    JW
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-semibold">Dr. Jane Wanjiku</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Licensed Clinical Psychologist', '10+ years experience', 'Anxiety, Depression, Trauma'].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">KES 3,500</span>
                    <span className="text-sm text-gray-500">per session</span>
                  </div>
                  <Link
                    href="/signup"
                    className="mt-3 block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Book Session
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Lamazi?</h2>
            <p className="text-xl text-gray-600">Safe, professional, and accessible mental health care</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands who have found support through Lamazi
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl text-lg font-medium"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <span className="text-xl font-semibold">Lamazi</span>
              </div>
              <p className="text-gray-400 text-sm">Professional mental health care for everyone</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/signup" className="hover:text-white transition-colors">Find a Therapist</Link></li>
                <li><Link href="/signup" className="hover:text-white transition-colors">How it Works</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Therapists</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="http://localhost:3001" className="hover:text-white transition-colors">
                    Therapist Portal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/emergency" className="hover:text-white transition-colors">Crisis Resources</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Lamazi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
