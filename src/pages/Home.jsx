import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { therapistAPI } from '../api';

function Stars({ rating }) {
  const full = Math.round(rating || 0);
  return <span className="star">{'★'.repeat(full)}{'☆'.repeat(5 - full)}</span>;
}

function FilterIcon() {
  return <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>;
}

const DEMO_THERAPISTS = [
  { id: '10000000-0000-0000-0000-000000000001', full_name: 'Dr. Sarah Johnson', rating: 4.9, review_count: 127, specialties: ['Anxiety', 'Depression', 'Stress Management'], bio: 'Licensed clinical psychologist with 10+ years of experience helping clients overcome anxiety and depression.', price_per_session: 80 },
  { id: '10000000-0000-0000-0000-000000000002', full_name: 'Michael Chen', rating: 4.8, review_count: 93, specialties: ['Couples Therapy', 'Relationship Issues', 'Communication'], bio: 'Experienced marriage and family therapist specializing in helping couples build stronger, healthier relationships.', price_per_session: 95 },
  { id: '10000000-0000-0000-0000-000000000003', full_name: 'Dr. Emily Rodriguez', rating: 5.0, review_count: 156, specialties: ['Trauma', 'PTSD', 'Grief Counseling'], bio: 'Trauma-informed therapist with specialized training in EMDR and somatic experiencing. Compassionate care.', price_per_session: 110 },
  { id: '10000000-0000-0000-0000-000000000004', full_name: 'James Wilson', rating: 4.7, review_count: 84, specialties: ['Teen Support', 'ADHD', 'Academic Stress'], bio: 'Child and adolescent psychologist dedicated to helping teens navigate challenges including ADHD and academic stress.', price_per_session: 75 },
  { id: '10000000-0000-0000-0000-000000000005', full_name: 'Dr. Priya Patel', rating: 4.9, review_count: 142, specialties: ['Anxiety', 'OCD', 'Mindfulness'], bio: 'Specializing in cognitive-behavioral therapy and mindfulness-based approaches for anxiety disorders.', price_per_session: 85 },
  { id: '10000000-0000-0000-0000-000000000006', full_name: 'Amanda Foster', rating: 4.8, review_count: 98, specialties: ['Depression', 'Life Transitions', 'Self-Esteem'], bio: 'Compassionate therapist helping clients navigate major life transitions, build self-esteem, and overcome challenges.', price_per_session: 70 },
];

const AVATAR_COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
const getColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function Home() {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { loadTherapists(); }, []);

  const loadTherapists = async (q = '') => {
    setLoading(true);
    try {
      const res = await therapistAPI.list({ q });
      setTherapists(res.data.therapists || DEMO_THERAPISTS);
    } catch {
      setTherapists(DEMO_THERAPISTS);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (val.length === 0 || val.length > 2) loadTherapists(val);
  };

  return (
    <div className="page">
      <NavBar />

      {/* Hero Banner */}
      <div className="hero">
        <h1>Find Your Perfect Therapist</h1>
        <p>Connect with verified, licensed professionals who understand your needs</p>
        <div className="search-box">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input placeholder="Search by name, specialty, or concern..." value={search} onChange={handleSearch} />
        </div>
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        <span>{therapists.length} therapists available</span>
        <button className="btn-filter">
          <FilterIcon /> Filters
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="therapist-grid">
          {therapists.map((t, idx) => (
            <div key={t.id} className="therapist-card" onClick={() => navigate(`/therapist/${t.id}`)}>
              <div className="therapist-card-img">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt={t.full_name} />
                ) : (
                  <div className="therapist-avatar-placeholder" style={{ background: getColor(t.full_name) }}>
                    <span>{getInitials(t.full_name)}</span>
                  </div>
                )}
                <div className="verified-badge">✓ Verified</div>
              </div>
              <div className="therapist-card-body">
                <h3>{t.full_name}</h3>
                <div className="rating">
                  <Stars rating={t.rating} />
                  <span>{t.rating ? t.rating.toFixed(1) : '—'} • {t.review_count} reviews</span>
                </div>
                <div className="tags">
                  {(t.specialties || []).slice(0, 3).map(s => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
                <p>{t.bio}</p>
                <div className="price">Ksh {t.price_per_session}/session</div>
                <button
                  className="btn-primary"
                  onClick={e => { e.stopPropagation(); navigate(`/book/${t.id}`); }}
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
