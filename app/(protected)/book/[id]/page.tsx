'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, CreditCard, Check, AlertCircle, Info, Phone, Loader } from 'lucide-react';

interface Slot { id: string; slot_date: string; slot_time: string; is_booked: boolean; }
interface Therapist { id: string; full_name: string; avatar_url?: string; specialties: string[]; price_per_session: number; }
interface CancellationRule { id: number; hours_before: number; refund_percent: number; description: string; }

type Step = 'datetime' | 'payment' | 'confirmation';
type PaymentType = 'full' | 'reservation';

export default function BookingFlowPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationRule[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>('datetime');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('full');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'visa' | 'mastercard'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('lamazi_token') : '';

  useEffect(() => {
    const load = async () => {
      try {
        const [therapistRes, policyRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/therapists/${params.id}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/cancellation-policy`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (therapistRes.ok) {
          const data = await therapistRes.json();
          setTherapist(data.therapist);
          setSlots(data.slots?.filter((s: Slot) => !s.is_booked) || []);
        }
        if (policyRes.ok) {
          const pData = await policyRes.json();
          setCancellationPolicy(pData.policy || []);
        }
      } catch (e) {
        setError('Failed to load booking information');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Loading booking details...</p>
      </div>
    </div>
  );

  if (!therapist) return (
    <div className="text-center py-20">
      <p className="text-gray-600">Therapist not found.</p>
      <Link href="/discover" className="text-blue-600 mt-4 inline-block">← Back to search</Link>
    </div>
  );

  // FIXED: No platform fee surcharge — client pays price_per_session only
  const sessionFee = therapist.price_per_session;
  const reservationAmount = Math.round(sessionFee * 0.30);
  const balanceDue = sessionFee - reservationAmount;
  const amountDueNow = paymentType === 'full' ? sessionFee : reservationAmount;

  const availableDates = [...new Set(slots.map(s => s.slot_date))];
  const timesForDate = slots.filter(s => s.slot_date === selectedDate);

  // Get refund percentage from real policy
  const daysUntilSession = selectedDate
    ? Math.ceil((new Date(selectedDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;
  const hoursUntilSession = daysUntilSession * 24;
  const applicableRule = cancellationPolicy
    .filter(r => hoursUntilSession >= r.hours_before)
    .sort((a, b) => b.hours_before - a.hours_before)[0];
  const refundPercent = applicableRule?.refund_percent ?? 0;

  const handleCompleteBooking = async () => {
    if (paymentMethod === 'mpesa' && !mpesaPhone.trim()) {
      setError('Please enter your M-Pesa phone number');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      // Step 1: Create booking
      const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          therapist_id: therapist.id,
          session_date: selectedDate,
          session_time: selectedTime,
          payment_type: paymentType,
          payment_method: paymentMethod,
          ...(paymentMethod === 'mpesa' ? { mpesa_phone: mpesaPhone } : {}),
        }),
      });

      if (!bookingRes.ok) {
        const err = await bookingRes.json().catch(() => ({ error: 'Booking failed' }));
        throw new Error(err.error || 'Failed to create booking');
      }

      const booking = await bookingRes.json();
      setBookingResult(booking);

      // Step 2: Initiate M-Pesa payment
      if (paymentMethod === 'mpesa') {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/mpesa/initiate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            booking_id: booking.booking_id,
            phone_number: mpesaPhone,
            amount: amountDueNow,
            purpose: 'session',
          }),
        });
      }

      setCurrentStep('confirmation');
      setTimeout(() => router.push('/bookings'), 4000);
    } catch (err: any) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { key: 'datetime', label: 'Date & Time', num: 1 },
    { key: 'payment', label: 'Payment', num: 2 },
    { key: 'confirmation', label: 'Confirmed', num: 3 },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <Link href={`/therapist/${params.id}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      {/* Progress */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === step.key ? 'bg-blue-600 text-white' :
                  steps.findIndex(s => s.key === currentStep) > i ? 'bg-green-500 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {steps.findIndex(s => s.key === currentStep) > i ? <Check className="w-4 h-4" /> : step.num}
                </div>
                <span className="text-xs text-gray-600 mt-1 hidden sm:block">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 h-1 bg-gray-200 mx-2 -mt-5">
                  <div className={`h-full bg-blue-600 transition-all ${steps.findIndex(s => s.key === currentStep) > i ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Therapist Summary */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200 flex items-center gap-4">
        {therapist.avatar_url ? (
          <img src={therapist.avatar_url} alt={therapist.full_name} className="w-16 h-16 rounded-full object-cover" />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {therapist.full_name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{therapist.full_name}</h3>
          <p className="text-sm text-gray-500">{therapist.specialties?.slice(0, 2).join(', ')}</p>
          <p className="text-blue-600 font-semibold mt-0.5">KES {sessionFee.toLocaleString()} / session</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* STEP 1: Date & Time */}
      {currentStep === 'datetime' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Select Date</h3>
            </div>
            {availableDates.length === 0 ? (
              <p className="text-gray-500 text-sm">No available dates. Please check back later.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => { setSelectedDate(date); setSelectedTime(''); setSelectedSlotId(''); }}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedDate && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Select Time</h3>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {timesForDate.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => { setSelectedTime(slot.slot_time); setSelectedSlotId(slot.id); }}
                    className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      selectedTime === slot.slot_time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {slot.slot_time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setCurrentStep('payment')}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {/* STEP 2: Payment */}
      {currentStep === 'payment' && (
        <div className="space-y-5">
          {/* Payment Type */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Payment Option</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { type: 'full' as PaymentType, label: 'Full Payment', amount: sessionFee, desc: 'Pay the full amount now' },
                { type: 'reservation' as PaymentType, label: 'Reservation (30%)', amount: reservationAmount, desc: `Reserve now, pay KES ${balanceDue.toLocaleString()} later` },
              ].map(({ type, label, amount, desc }) => (
                <button
                  key={type}
                  onClick={() => setPaymentType(type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    paymentType === type ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">{label}</span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentType === type ? 'border-blue-600' : 'border-gray-300'}`}>
                      {paymentType === type && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">KES {amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
            {paymentType === 'reservation' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Note:</strong> The remaining KES {balanceDue.toLocaleString()} must be paid at least 24 hours before your session.
              </div>
            )}
          </div>

          {/* Cancellation Policy from real API */}
          {cancellationPolicy.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
              </div>
              <div className="space-y-2">
                {cancellationPolicy.map(rule => (
                  <div key={rule.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${rule.refund_percent === 100 ? 'bg-green-500' : rule.refund_percent > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <p className="text-sm text-gray-700">{rule.description}</p>
                  </div>
                ))}
              </div>
              {selectedDate && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  Your session is in <strong>{daysUntilSession} days</strong>. If you cancel now, you&apos;ll receive a <strong>{refundPercent}% refund</strong>.
                </div>
              )}
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Payment Method</h3>
            </div>

            <div className="space-y-3 mb-5">
              {(['mpesa', 'visa', 'mastercard'] as const).map(method => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`w-full px-4 py-3 rounded-lg border text-left text-sm font-medium transition-colors ${
                    paymentMethod === method ? 'bg-blue-50 border-blue-600 text-blue-900' : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {method === 'mpesa' ? 'M-Pesa' : method === 'visa' ? 'Visa' : 'Mastercard'}
                </button>
              ))}
            </div>

            {/* M-Pesa phone number — required */}
            {paymentMethod === 'mpesa' && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 mb-2">M-Pesa Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="0712345678"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">You will receive an M-Pesa prompt on this number</p>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Session fee</span>
                <span>KES {sessionFee.toLocaleString()}</span>
              </div>
              {paymentType === 'reservation' && (
                <>
                  <div className="flex justify-between text-sm text-blue-600 font-medium">
                    <span>Pay now (30%)</span>
                    <span>KES {reservationAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Pay later (balance)</span>
                    <span>KES {balanceDue.toLocaleString()}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Due today</span>
                <span>KES {amountDueNow.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm">Your payment information is encrypted and secure. You will receive a Google Meet link upon confirmation.</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep('datetime')}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleCompleteBooking}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                `Confirm & Pay KES ${amountDueNow.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Confirmation */}
      {currentStep === 'confirmation' && (
        <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your session with {therapist.full_name} has been scheduled.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date:</span>
              <span className="text-gray-900 font-medium">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Time:</span>
              <span className="text-gray-900 font-medium">{selectedTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Duration:</span>
              <span className="text-gray-900 font-medium">60 minutes</span>
            </div>
            {bookingResult?.meeting_link && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Meeting:</span>
                <a href={bookingResult.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                  Join Google Meet
                </a>
              </div>
            )}
          </div>

          {paymentMethod === 'mpesa' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-sm text-amber-800">
              <strong>Check your phone!</strong> An M-Pesa STK push has been sent to {mpesaPhone}. Enter your PIN to complete payment.
            </div>
          )}

          <p className="text-gray-400 text-sm">Redirecting to your bookings in a moment...</p>
        </div>
      )}
    </div>
  );
}
