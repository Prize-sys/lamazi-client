import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { bookingAPI } from '../api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    bookingAPI.list({ status: 'confirmed' }).then(res => setBookings(res.data.bookings || [])).catch(() => setBookings([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Upcoming Sessions</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>{bookings.length} sessions</p>
        {loading ? <div className="spinner" /> : bookings.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <h3 style={{ fontWeight: 600, marginBottom: 6 }}>No upcoming sessions</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>Book a session with a therapist to get started</p>
            <button className="btn-primary" style={{ maxWidth: 200, margin: '0 auto', display: 'block' }} onClick={() => navigate('/')}>Find a Therapist</button>
          </div>
        ) : bookings.map(b => (
          <div key={b.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>
                  {b.therapist_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.therapist_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>📅 {b.session_date} • ⏰ {b.session_time} ({b.duration_minutes || 60} minutes)</div>
                </div>
              </div>
              <span className="badge badge-confirmed">✓ Confirmed</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
              <button className="btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>📄 Receipt</button>
              <span style={{ fontWeight: 700 }}>${b.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
