import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Globe, Award, ArrowLeft, Calendar, CheckCircle } from 'lucide-react';

async function getTherapist(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/therapists/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function TherapistDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getTherapist(params.id);
  if (!data) notFound();

  const { therapist, reviews = [], slots = [] } = data;
  const availableSlots = slots.filter((s: any) => !s.is_booked);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to search
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-64 flex-shrink-0">
            {therapist.avatar_url ? (
              <img
                src={therapist.avatar_url}
                alt={therapist.full_name}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <span className="text-white text-6xl font-bold">
                  {therapist.full_name?.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="p-6 md:flex-1 space-y-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{therapist.full_name}</h1>
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-gray-900">{therapist.rating}</span>
                    <span>({therapist.review_count} reviews)</span>
                  </div>
                  {therapist.years_of_experience && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>{therapist.years_of_experience} yrs experience</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  KES {therapist.price_per_session?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">per session</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {therapist.specialties?.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>

            <div className="flex gap-4 text-gray-600 text-sm flex-wrap">
              {therapist.languages && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>{therapist.languages}</span>
                </div>
              )}
              {therapist.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{therapist.city}, {therapist.country}</span>
                </div>
              )}
            </div>

            <Link
              href={`/book/${therapist.id}`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
            >
              <Calendar className="w-4 h-4" />
              Book a Session
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: About + Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{therapist.bio}</p>
            {therapist.education && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Education</h3>
                <p className="text-gray-600 text-sm">{therapist.education}</p>
              </div>
            )}
            {therapist.license_number && (
              <div className="mt-3">
                <span className="text-sm text-gray-500">License: </span>
                <span className="text-sm text-gray-700 font-medium">{therapist.license_number}</span>
              </div>
            )}
          </div>

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{therapist.rating} / 5</span>
                </div>
              </div>
              <div className="space-y-4">
                {reviews.map((review: any) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">
                        {review.is_anonymous ? 'Anonymous' : review.client_name}
                      </span>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Sidebar */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Slots</h2>

            {availableSlots.length > 0 ? (
              <>
                <div className="space-y-2 mb-5 max-h-64 overflow-y-auto">
                  {availableSlots.slice(0, 6).map((slot: any) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between px-4 py-2.5 border border-blue-200 rounded-lg bg-blue-50"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(slot.slot_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-500">{slot.slot_time}</div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                </div>

                <Link
                  href={`/book/${therapist.id}`}
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
                >
                  Book Session
                </Link>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No available slots at the moment</p>
                <p className="text-xs mt-1 text-gray-400">Check back soon</p>
              </div>
            )}

            <div className="mt-5 pt-5 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">What to expect</h3>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {['60-minute video session', 'Google Meet link via email', 'Secure & confidential', 'Cancel up to 24hrs before'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
