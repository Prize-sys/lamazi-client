import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #F5F3FF 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 32, fontWeight: 600, color: 'var(--blue)' }}>MindCare</div>
          <p style={{ color: 'var(--gray-500)', fontSize: 14 }}>Start your journey to wellness</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create account</h2>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>Join thousands finding mental wellness</p>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="Jane Doe" value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@email.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" placeholder="+254700000000" value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min 8 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 20, color: 'var(--gray-500)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
