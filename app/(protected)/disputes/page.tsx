'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Loader, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Dispute {
  id: string;
  booking_id: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  resolution?: string;
}

interface Booking {
  id: string;
  therapist_name: string;
  session_date: string;
}

const REASONS = [
  { value: 'misconduct', label: 'Therapist Misconduct' },
  { value: 'no_show', label: 'Therapist No-Show' },
  { value: 'technical_issue', label: 'Technical Issue' },
  { value: 'payment_dispute', label: 'Payment Dispute' },
  { value: 'safety_concern', label: 'Safety Concern' },
  { value: 'other', label: 'Other' },
];

const STATUS_CONFIG: Record<string, { cls: string; icon: React.ReactNode; label: string }> = {
  open:          { cls: 'bg-yellow-100 text-yellow-700', icon: <Clock className="w-3.5 h-3.5" />, label: 'Open' },
  investigating: { cls: 'bg-blue-100 text-blue-700', icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Investigating' },
  resolved:      { cls: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3.5 h-3.5" />, label: 'Resolved' },
  closed:        { cls: 'bg-gray-100 text-gray-700', icon: <XCircle className="w-3.5 h-3.5" />, label: 'Closed' },
};

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ booking_id: '', reason: '', description: '', evidence_url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('lamazi_token') : '';

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [dRes, bRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes/mine`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (dRes.ok) { const d = await dRes.json(); setDisputes(d.disputes || []); }
        if (bRes.ok) { const b = await bRes.json(); setBookings(b.bookings || []); }
      } catch {
        // ignore
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.booking_id || !form.reason || !form.description.trim()) {
      setSubmitError('Please fill in all required fields');
      return;
    }
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          booking_id: form.booking_id,
          reason: form.reason,
          description: form.description,
          ...(form.evidence_url ? { evidence_url: form.evidence_url } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Submission failed' }));
        throw new Error(err.error || 'Failed to file dispute');
      }
      setSubmitSuccess(true);
      setShowForm(false);
      setForm({ booking_id: '', reason: '', description: '', evidence_url: '' });
      // Reload disputes
      const dRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/disputes/mine`, { headers: { Authorization: `Bearer ${token}` } });
      if (dRes.ok) { const d = await dRes.json(); setDisputes(d.disputes || []); }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to file dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Disputes</h2>
          <p className="text-gray-500 text-sm mt-0.5">Report issues with your sessions</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSubmitSuccess(false); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          File Dispute
        </button>
      </div>

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">Dispute filed successfully. Our team will review within 48 hours.</p>
        </div>
      )}

      {/* File Dispute Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">File a Dispute</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Booking *</label>
              <select
                value={form.booking_id}
                onChange={e => setForm({ ...form, booking_id: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                required
              >
                <option value="">Select a booking...</option>
                {bookings.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.therapist_name} — {new Date(b.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason *</label>
              <select
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                required
              >
                <option value="">Select a reason...</option>
                {REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Please describe the issue in detail..."
                rows={5}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Evidence URL (optional)</label>
              <input
                type="url"
                value={form.evidence_url}
                onChange={e => setForm({ ...form, evidence_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Upload screenshots to Firebase Storage and paste the URL here</p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{submitError}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit Dispute'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Disputes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Loading disputes...</p>
          </div>
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-gray-900 font-semibold mb-2">No disputes filed</h3>
          <p className="text-gray-500 text-sm">If you have an issue with a session, use the button above to file a dispute.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map(dispute => {
            const cfg = STATUS_CONFIG[dispute.status] || STATUS_CONFIG.open;
            return (
              <div key={dispute.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {REASONS.find(r => r.value === dispute.reason)?.label || dispute.reason}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Booking #{dispute.booking_id} &bull; {new Date(dispute.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
                    {cfg.icon}{cfg.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{dispute.description}</p>
                {dispute.resolution && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Resolution:</p>
                    <p className="text-sm text-gray-700">{dispute.resolution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
