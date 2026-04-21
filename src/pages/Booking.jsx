import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI, bookingAPI, paymentAPI } from '../api';

const PAYMENT_METHODS = ['M-Pesa', 'Visa', 'Mastercard', 'PayPal'];

export default function Booking() {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [therapist, setTherapist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [payMethod, setPayMethod] = useState('M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return { value: d.toISOString().slice(0, 10), label: d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });
  const times = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00'];

  useEffect(() => {
    therapistAPI.get(therapistId)
      .then(res => setTherapist(res.data.therapist))
      .catch(() => setTherapist({ id: therapistId, full_name: 'Dr. Sarah Johnson', specialties: ['Anxiety', 'Depression', 'Stress Management'], price_per_session: 80, avatar_url: null }));
    setSelectedDate(dates[0]?.value);
    setSelectedTime(times[0]);
  }, [therapistId]);

  const handleConfirmPay = async () => {
    setLoading(true); setError('');
    try {
      const bookRes = await bookingAPI.create({ therapist_id: therapistId, session_date: selectedDate, session_time: selectedTime, payment_method: payMethod.toLowerCase().replace('-',''), mpesa_phone: mpesaPhone });
      await paymentAPI.simulate(bookRes.data.booking_id);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!therapist) return <div className="page"><NavBar /><div className="spinner" /></div>;

  const fee = +(therapist.price_per_session * 0.15).toFixed(2);
  const total = +(therapist.price_per_session + fee).toFixed(2);
  const AVATAR_COLORS = ['#6366F1','#EC4899','#F59E0B','#10B981','#3B82F6','#8B5CF6'];
  const avatarColor = AVATAR_COLORS[therapist.full_name.charCodeAt(0) % AVATAR_COLORS.length];
  const initials = therapist.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();

  const TherapistMini = () => (
    <div className="card" style={{ padding:16, marginBottom:16, display:'flex', gap:14, alignItems:'center' }}>
      <div style={{ width:52, height:52, borderRadius:26, overflow:'hidden', flexShrink:0, background: avatarColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {therapist.avatar_url
          ? <img src={therapist.avatar_url} alt={therapist.full_name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
          : <span style={{color:'white',fontWeight:700,fontSize:16}}>{initials}</span>}
      </div>
      <div>
        <div style={{ fontWeight:700, fontSize:15 }}>{therapist.full_name}</div>
        <div style={{ fontSize:12, color:'var(--gray-500)', marginTop:2 }}>{(therapist.specialties||[]).join(', ')}</div>
        <div style={{ fontSize:13, fontWeight:600, marginTop:3 }}>${therapist.price_per_session} / session</div>
      </div>
    </div>
  );

  const StepBar = () => (
    <div className="steps">
      {[['Date & Time', 1], ['Payment', 2], ['Confirmed', 3]].map(([label, n], i, arr) => (
        <React.Fragment key={n}>
          <div className="step">
            <div className={`step-num ${step === n ? 'active' : step > n ? 'done' : ''}`}>
              {step > n ? '✓' : n}
            </div>
            <span className={`step-label ${step === n ? 'active' : ''}`}>{label}</span>
          </div>
          {i < arr.length - 1 && <div className={`step-line ${step > n ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth:640, margin:'0 auto', padding:16 }}>
        <button onClick={() => step > 1 ? setStep(s=>s-1) : navigate(-1)} style={{ background:'none', color:'var(--gray-500)', fontSize:14, display:'flex', alignItems:'center', gap:6, marginBottom:16, padding:0, border:'none', cursor:'pointer' }}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          Back
        </button>

        <StepBar />
        <TherapistMini />
        {error && <div className="alert alert-error">{error}</div>}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="card" style={{ padding:20 }}>
            <div style={{ marginBottom:20 }}>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, display:'flex', alignItems:'center', gap:6, color:'var(--gray-700)' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16,color:'var(--blue)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                Select Date
              </h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {dates.map(d => (
                  <button key={d.value} onClick={() => setSelectedDate(d.value)} style={{ padding:'10px 14px', borderRadius:'var(--radius-sm)', border:`2px solid ${selectedDate===d.value ? 'var(--blue)' : 'var(--gray-200)'}`, background: selectedDate===d.value ? 'var(--blue)' : 'white', color: selectedDate===d.value ? 'white' : 'var(--gray-700)', fontWeight:500, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, display:'flex', alignItems:'center', gap:6, color:'var(--gray-700)' }}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16,color:'var(--blue)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Select Time
              </h3>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {times.map(t => (
                  <button key={t} onClick={() => setSelectedTime(t)} style={{ padding:'10px 16px', borderRadius:'var(--radius-sm)', border:`2px solid ${selectedTime===t ? 'var(--blue)' : 'var(--gray-200)'}`, background: selectedTime===t ? 'var(--blue)' : 'white', color: selectedTime===t ? 'white' : 'var(--gray-700)', fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ marginTop:24 }} onClick={() => { if (!selectedDate || !selectedTime) { setError('Please select date and time'); return; } setError(''); setStep(2); }}>
              Continue to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="card" style={{ padding:20 }}>
            <h3 style={{ fontSize:14, fontWeight:600, marginBottom:12, display:'flex', alignItems:'center', gap:6, color:'var(--gray-700)' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:16,height:16,color:'var(--blue)'}}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
              Payment Method
            </h3>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:20 }}>
              {PAYMENT_METHODS.map(m => (
                <button key={m} onClick={() => setPayMethod(m)} style={{ padding:'13px 16px', borderRadius:'var(--radius-sm)', border:`2px solid ${payMethod===m ? 'var(--blue)' : 'var(--gray-200)'}`, background: payMethod===m ? '#EFF6FF' : 'white', color: payMethod===m ? 'var(--blue)' : 'var(--gray-700)', fontWeight:500, textAlign:'left', fontSize:14, cursor:'pointer', transition:'all 0.15s' }}>
                  {m}
                </button>
              ))}
            </div>
            {payMethod === 'M-Pesa' && (
              <div className="form-group">
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" placeholder="254700000000" value={mpesaPhone} onChange={e => setMpesaPhone(e.target.value)} />
              </div>
            )}
            <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-sm)', padding:14, marginBottom:14, border:'1px solid var(--gray-100)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, fontSize:14 }}>
                <span style={{ color:'var(--gray-600)' }}>Session fee</span><span>${therapist.price_per_session}.00</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14, color:'var(--gray-500)' }}>
                <span>Platform fee (15%)</span><span>${fee}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, fontSize:15, borderTop:'1px solid var(--gray-200)', paddingTop:8 }}>
                <span>Total</span><span>${total}</span>
              </div>
            </div>
            <div style={{ fontSize:12, color:'var(--gray-500)', marginBottom:14, padding:12, background:'#EFF6FF', borderRadius:'var(--radius-sm)', border:'1px solid #BFDBFE' }}>
              🔒 Your payment information is encrypted and secure. You will receive a receipt via email after booking confirmation.
            </div>
            <button className="btn-primary" onClick={handleConfirmPay} disabled={loading}>
              {loading ? 'Processing...' : `Confirm & Pay $${total}`}
            </button>
          </div>
        )}

        {/* Step 3: Confirmed */}
        {step === 3 && (
          <div className="card" style={{ padding:28, textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:32, background:'#DCFCE7', border:'2px solid #BBF7D0', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24, color:'var(--green)' }}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width:32,height:32}}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </div>
            <h2 style={{ fontSize:20, fontWeight:700, marginBottom:6 }}>Booking Confirmed!</h2>
            <p style={{ color:'var(--gray-500)', fontSize:14, marginBottom:20 }}>Your session with {therapist.full_name} has been scheduled.</p>
            <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-sm)', padding:16, textAlign:'left', marginBottom:16, border:'1px solid var(--gray-100)' }}>
              {[
                ['Date', new Date(selectedDate).toLocaleDateString('en', { weekday:'long', year:'numeric', month:'long', day:'numeric' })],
                ['Time', selectedTime],
                ['Duration', '60 minutes'],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                  <span style={{ color:'var(--gray-500)' }}>{k}:</span>
                  <span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background:'#EFF6FF', borderRadius:'var(--radius-sm)', padding:12, fontSize:13, color:'#1D4ED8', marginBottom:20, lineHeight:1.6 }}>
              Zoom link will be sent to your email 30 minutes before the session.<br />
              You will also receive a calendar invite and SMS reminder.
            </div>
            <p style={{ fontSize:12, color:'var(--gray-400)', marginBottom:16 }}>Redirecting to your bookings...</p>
            <button className="btn-primary" onClick={() => navigate('/bookings')}>View My Bookings</button>
          </div>
        )}
      </div>
    </div>
  );
}
