import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { bookingAPI } from '../api';

const DEMO_HISTORY = [
  { id: '1', therapist_name: 'Dr. Sarah Johnson', session_date: 'Wednesday, December 10, 2025', session_time: '09:00', duration_minutes: 60, status: 'confirmed', amount: 80 },
  { id: '2', therapist_name: 'Michael Chen', session_date: 'Thursday, December 11, 2025', session_time: '13:00', duration_minutes: 60, status: 'confirmed', amount: 95 },
  { id: '3', therapist_name: 'Dr. Emily Rodriguez', session_date: 'Friday, December 5, 2025', session_time: '14:00', duration_minutes: 60, status: 'completed', amount: 110 },
  { id: '4', therapist_name: 'Dr. Sarah Johnson', session_date: 'Friday, December 12, 2025', session_time: '11:00', duration_minutes: 60, status: 'pending', amount: 80 },
];

const STATUS_BADGE = { confirmed: 'badge-confirmed', completed: 'badge-completed', pending: 'badge-pending', cancelled: 'badge-cancelled' };
const STATUS_LABEL = { confirmed: '✓ Confirmed', completed: '✓ Completed', pending: '⏳ Pending', cancelled: '✕ Cancelled' };

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.list().then(res => setHistory(res.data.bookings || DEMO_HISTORY)).catch(() => setHistory(DEMO_HISTORY)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <NavBar />
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Session History</h2>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginBottom: 20 }}>{history.length} sessions</p>
        {loading ? <div className="spinner" /> : history.map(b => (
          <div key={b.id} className="card" style={{ padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>
                  {b.therapist_name?.split(' ').filter(n => n.match(/^[A-Z]/)).map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{b.therapist_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>📅 {b.session_date}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>⏰ {b.session_time} ({b.duration_minutes || 60} minutes)</div>
                </div>
              </div>
              <span className={`badge ${STATUS_BADGE[b.status] || 'badge-pending'}`}>{STATUS_LABEL[b.status]}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {b.status === 'completed' && <button className="btn-outline" style={{ fontSize: 12, padding: '6px 12px', color: 'var(--blue)', borderColor: 'var(--blue)' }}>⭐ Leave Review</button>}
                <button className="btn-outline" style={{ fontSize: 12, padding: '6px 12px' }}>📄 Receipt</button>
              </div>
              <span style={{ fontWeight: 700 }}>${b.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
