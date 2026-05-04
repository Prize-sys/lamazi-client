'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, Loader, ExternalLink, AlertCircle } from 'lucide-react';

interface Agreement {
  type: string;
  version: string;
  title: string;
  url?: string;
}

interface ConsentStatus {
  status: Record<string, { accepted: boolean; version: string; accepted_at: string }>;
  missing_required: string[];
  onboarding_complete: boolean;
}

const AGREEMENT_LABELS: Record<string, string> = {
  privacy_policy:           'Privacy Policy',
  terms_of_service:         'Terms of Service',
  therapist_code_of_conduct:'Therapist Code of Conduct',
  data_processing:          'Data Processing Agreement',
};

export default function ConsentPage() {
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('lamazi_token') : '';

  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus | null>(null);
  const [accepted, setAccepted]     = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading]   = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [agreementsRes, statusRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consent/agreements`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/consent/status`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (agreementsRes.ok) {
          const data = await agreementsRes.json();
          setAgreements(data.agreements || []);
        }
        if (statusRes.ok) {
          const data = await statusRes.json();
          setConsentStatus(data);
          // Pre-check already accepted agreements
          const alreadyAccepted = new Set<string>(
            Object.entries(data.status || {})
              .filter(([, v]: any) => v.accepted)
              .map(([k]) => k)
          );
          setAccepted(alreadyAccepted);
        }
      } catch { /* ignore */ }
      finally { setIsLoading(false); }
    };
    load();
  }, [token]);

  const toggleAgreement = (type: string) => {
    setAccepted(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const missingRequired = consentStatus?.missing_required || [];
  const allRequiredAccepted = missingRequired.every(r => accepted.has(r));

  const handleSubmit = async () => {
    const toAccept = Array.from(accepted).filter((a) => !consentStatus?.status?.[a]?.accepted);
    if (toAccept.length === 0) {
      router.push('/discover');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ agreements: toAccept }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' }));
        throw new Error(err.error || 'Failed to record agreements');
      }
      setSuccess(true);
      setTimeout(() => router.push('/discover'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to record consent');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading agreements...</p>
        </div>
      </div>
    );
  }

  // If onboarding already complete, redirect
  if (consentStatus?.onboarding_complete) {
    router.push('/discover');
    return null;
  }

  // Fallback agreement list if API returns empty
  const displayAgreements = agreements.length > 0
    ? agreements
    : [
        { type: 'privacy_policy',   version: '1.0', title: 'Privacy Policy' },
        { type: 'terms_of_service', version: '1.0', title: 'Terms of Service' },
        { type: 'data_processing',  version: '1.0', title: 'Data Processing Agreement' },
      ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review &amp; Accept Agreements</h2>
        <p className="text-gray-500 text-sm mt-2">
          Please review and accept the following agreements to continue using Lamazi.
        </p>
      </div>

      {missingRequired.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            You have <strong>{missingRequired.length}</strong> required agreement{missingRequired.length > 1 ? 's' : ''} to accept before you can continue.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {displayAgreements.map((agreement) => {
          const isAccepted = accepted.has(agreement.type);
          const isRequired = missingRequired.includes(agreement.type) || !consentStatus;
          const alreadyDone = consentStatus?.status?.[agreement.type]?.accepted;
          const label = AGREEMENT_LABELS[agreement.type] || agreement.title;

          return (
            <div key={agreement.type} className="p-5">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => !alreadyDone && toggleAgreement(agreement.type)}
                  disabled={alreadyDone}
                  className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-colors ${
                    isAccepted || alreadyDone
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 hover:border-blue-400'
                  } ${alreadyDone ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                >
                  {(isAccepted || alreadyDone) && <CheckCircle className="w-4 h-4 text-white" />}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{label}</span>
                    {isRequired && !alreadyDone && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Required</span>
                    )}
                    {alreadyDone && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />Already accepted
                      </span>
                    )}
                    <span className="text-xs text-gray-400">v{agreement.version}</span>
                  </div>

                  {alreadyDone && consentStatus?.status?.[agreement.type]?.accepted_at && (
                    <p className="text-xs text-gray-400 mb-2">
                      Accepted on {new Date(consentStatus.status[agreement.type].accepted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}

                  {agreement.url && (
                    <a
                      href={agreement.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ExternalLink className="w-3 h-3" />Read full document
                    </a>
                  )}

                  {!isAccepted && !alreadyDone && (
                    <p className="text-xs text-gray-500 mt-1">
                      By checking this box, you agree to the {label}.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">Agreements recorded! Redirecting...</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push('/discover')}
          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
        >
          Skip for Now
        </button>
        <button
          onClick={handleSubmit}
          disabled={!allRequiredAccepted || isSubmitting}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><Loader className="w-4 h-4 animate-spin" />Recording...</>
          ) : (
            <><CheckCircle className="w-4 h-4" />Accept &amp; Continue</>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-gray-400">
        Your consent records are stored securely. You can review accepted agreements anytime from your profile.
      </p>
    </div>
  );
}
