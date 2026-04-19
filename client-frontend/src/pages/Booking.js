import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI, bookingAPI, paymentAPI } from '../api';

const PAYMENT_METHODS = ['M-Pesa', 'Visa', 'Mastercard', 'PayPal'];

export default function Booking() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [therapist, setTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [payMethod, setPayMethod] = useState('M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [bookingId, setBookingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  // Generate next 5 days
  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { value: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  useEffect(() => {
    therapistAPI.get(therapistId)
      .then(res => setTherapist(res.data.therapist))
      .catch(() => setTherapist({ id: therapistId, full_name: 'Dr. Sarah Johnson', specialties: ['Anxiety', 'Depression', 'Stress Management'], price_per_session: 80 }));
    if (dates.length) setSelectedDate(dates[0].value);
    if (times.length) setSelectedTime(times[0]);
  }, [therapistId]);

  const handleContinueToPayment = () => {
    if (!selectedDate || !selectedTime) { setError('Please select date and time'); return; }
    setError(''); setStep(2);
  };

  const handleConfirmPay = async () => {
    setLoading(true); setError('');
    try {
      // Create booking
      const bookRes = await bookingAPI.create({ therapist_id: therapistId, session_date: selectedDate, session_time: selectedTime, payment_method: payMethod.toLowerCase().replace('-', ''), mpesa_phone: mpesaPhone });
      const bId = bookRes.data.booking_id;
      setBookingId(bId);

      // Simulate payment (in real app, use M-Pesa STK push)
      await paymentAPI.simulate(bId);
      setStep(3); setConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!therapist) return <div className="page"><NavBar /><div className="spinner" /></div>;

  const fee = therapist.price_per_session * 0.15;
  const total = therapist.price_per_session + fee;

  const StepIndicator = () => (
    <div className="steps">
      <div className="step">
        <div className={`step-num ${step === 1 ? 'active' : 'done'}`}>{step > 1 ? '✓' : '1'}</div>
        <span className={`step-label ${step === 1 ? 'active' : ''}`}>Date & Time</span>
      </div>
      <div className={`step-line ${step > 1 ? 'done' : ''}`} />
      <div className="step">
        <div className={`step-num ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`}>{step > 2 ? '✓' : '2'}</div>
        <span className={`step-label ${step === 2 ? 'active' : ''}`}>Payment</span>
      </div>
      <div className={`step-line ${step > 2 ? 'done' : ''}`} />
      <div className="step">
        <div className={`step-num ${step === 3 ? 'done' : ''}`}>{step === 3 ? '✓' : '3'}</div>
        <span className={`step-label ${step === 3 ? 'active' : ''}`}>Confirmed</span>
      </div>
    </div>
  );

  const TherapistCard = () => (
    <div className="card" style={{ padding: 16, marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ width: 50, height: 50, borderRadius: 25, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, flexShrink: 0 }}>
        {therapist.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{therapist.full_name}</div>
        <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{(therapist.specialties || []).join(', ')}</div>
        <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>${therapist.price_per_session} / session</div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} style={{ background: 'none', color: 'var(--gray-500)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: 0 }}>
          ← Back
        </button>
        <StepIndicator />
        <TherapistCard />
        {error && <div className="alert alert-error">{error}</div>}

        {step === 1 && (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>📅 Select Date</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {dates.map(d => (
                  <button key={d.value} onClick={() => setSelectedDate(d.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${selectedDate === d.value ? 'var(--blue)' : 'var(--gray-200)'}`, background: selectedDate === d.value ? 'var(--blue)' : 'white', color: selectedDate === d.value ? 'white' : 'var(--gray-700)', fontWeight: 500, fontSize: 13 }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>🕐 Select Time</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {times.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ padding: '10px 16px', borderRadius: 8, border: `2px solid ${selectedTime === t ? 'var(--blue)' : 'var(--gray-200)'}`, background: selectedTime === t ? 'var(--blue)' : 'white', color: selectedTime === t ? 'white' : 'var(--gray-700)', fontWeight: 500 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={handleContinueToPayment}>
              Continue to Payment
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>💳 Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m} onClick={() => setPayMethod(m)} style={{ padding: '12px 16px', borderRadius: 8, border: `2px solid ${payMethod === m ? 'var(--blue)' : 'var(--gray-200)'}`, background: payMethod === m ? 'var(--blue-light)' : 'white', color: payMethod === m ? 'var(--blue)' : 'var(--gray-700)', fontWeight: 500, textAlign: 'left', fontSize: 14 }}>
                  {payMethod === m ? '● ' : '○ '}{m}
                </button>
              ))}
            </div>
            {payMethod === 'M-Pesa' && (
              <div className="form-group">
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" placeholder="254700000000" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} />
              </div>
            )}
            <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14 }}>
                <span>Session fee</span><span>${therapist.price_per_session}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--gray-500)' }}>
                <span>Platform fee (15%)</span><span>${fee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 15, borderTop: '1px solid var(--gray-200)', paddingTop: 8 }}>
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 16, padding: 12, background: 'var(--blue-light)', borderRadius: 8 }}>
              🔒 Your payment information is encrypted and secure. You will receive a receipt via email after booking confirmation.
            </div>
            <button className="btn-primary" onClick={handleConfirmPay} disabled={loading}>
              {loading ? 'Processing...' : `Confirm & Pay $${total.toFixed(2)}`}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: 'var(--green-light)', border: '2px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>
              ✓
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Booking Confirmed!</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>Your session with {therapist.full_name} has been scheduled.</p>
            <div style={{ background: 'var(--gray-50)', borderRadius: 8, padding: 16, textAlign: 'left', marginBottom: 16 }}>
              {[['Date', new Date(selectedDate).toLocaleDateString('en', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })], ['Time', selectedTime], ['Duration', '60 minutes']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--gray-500)' }}>{k}:</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--blue-light)', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--blue-dark)', marginBottom: 20 }}>
              Zoom link will be sent to your email 30 minutes before the session.<br />You will also receive a calendar invite and SMS reminder.
            </div>
            <button className="btn-primary" onClick={() => navigate('/bookings')}>View My Bookings</button>
          </div>
        )}
      </div>
    </div>
  );
}
