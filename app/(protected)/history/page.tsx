'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Video, Star, CheckCircle, XCircle, AlertCircle, FileText, Loader } from 'lucide-react';

interface Booking {
  id: string;
  therapist_name: string;
  session_date: string;
  session_time: string;
  duration_minutes?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_type: 'full' | 'reservation';
  amount?: number;
  reservation_amount?: number;
  meeting_link?: string;
}

function StatusBadge({ status }: { status: Booking['status'] }) {
  const map: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
    confirmed: { cls: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Confirmed' },
    pending:   { cls: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: <AlertCircle className="w-3.5 h-3.5" />, label: 'Pending' },
    completed: { cls: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Completed' },
    cancelled: { cls: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Cancelled' },
  };
  const { cls, icon, label } = map[status] ?? map.pending;
  return (
    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${cls}`}>
      {icon}{label}
    </span>
  );
}

function ReviewModal({ bookingId, onClose, onSubmit }: { bookingId: string; onClose: () => void; onSubmit: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setIsSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('lamazi_token')}`,
        },
        body: JSON.stringify({ rating, comment, is_anonymous: isAnonymous }),
      });
      setSuccess(true);
      setTimeout(() => { onSubmit(); }, 1200);
    } catch {
      // fail silently
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        {success ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Review Submitted!</h3>
            <p className="text-sm text-gray-500 mt-1">Thank you for your feedback.</p>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star className={`w-8 h-8 transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
            <label className="flex items-center gap-2 mb-5 cursor-pointer">
              <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="rounded text-blue-600" />
              <span className="text-sm text-gray-700">Post anonymously</span>
            </label>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!rating || isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit Review'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const load = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('lamazi_token')}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const past = bookings.filter(b => {
    const d = new Date(b.session_date);
    return d < new Date() || b.status === 'completed' || b.status === 'cancelled';
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600 text-sm">Loading session history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Session History</h2>
        <p className="text-gray-500 text-sm mt-0.5">{past.length} session{past.length !== 1 ? 's' : ''}</p>
      </div>

      {past.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 font-semibold mb-2">No past sessions</h3>
          <p className="text-gray-500 text-sm mb-5">Your completed sessions will appear here</p>
          <Link href="/discover" className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            Find a Therapist
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {past.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {booking.therapist_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.therapist_name}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(booking.session_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.session_time} &bull; {booking.duration_minutes || 60} minutes
                    </div>
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 flex-wrap">
                  {booking.status === 'completed' && !reviewedIds.has(booking.id) && (
                    <button
                      onClick={() => setReviewBookingId(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200 text-sm font-medium"
                    >
                      <Star className="w-4 h-4" />
                      Leave Review
                    </button>
                  )}
                  {booking.status === 'completed' && reviewedIds.has(booking.id) && (
                    <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Review submitted
                    </span>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    Receipt
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">KES {booking.amount?.toLocaleString() || booking.reservation_amount?.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 capitalize">{booking.payment_type} payment</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewBookingId && (
        <ReviewModal
          bookingId={reviewBookingId}
          onClose={() => setReviewBookingId(null)}
          onSubmit={() => {
            setReviewedIds(prev => new Set([...prev, reviewBookingId]));
            setReviewBookingId(null);
          }}
        />
      )}
    </div>
  );
}
