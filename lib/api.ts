/**
 * Lamazi Client — API Service
 * Central fetch wrapper — all pages import from here
 */

const BASE = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function token(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('lamazi_token');
}

function headers(extra?: Record<string, string>): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra };
  const t = token();
  if (t) h['Authorization'] = `Bearer ${t}`;
  return h;
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE()}${path}`, { ...init, headers: headers(init.headers as Record<string, string>) });
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('lamazi_token');
      localStorage.removeItem('lamazi_user');
      window.location.href = '/login';
    }
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const api = {
  // Auth
  login:          (email: string, password: string) =>
    req<any>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register:       (data: any) =>
    req<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  sendOTP:        (email: string) =>
    req<any>('/auth/otp/send', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOTP:      (email: string, otp_code: string) =>
    req<any>('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ email, otp_code }) }),
  forgotPassword: (email: string) =>
    req<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword:  (email: string, otp_code: string, new_password: string) =>
    req<any>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ email, otp_code, new_password }) }),
  changePassword: (current_password: string, new_password: string) =>
    req<any>('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),
  me:             () => req<any>('/auth/me'),

  // Therapist Discovery
  nearbyTherapists: (params: Record<string, any>) =>
    req<any>(`/therapists/nearby?${new URLSearchParams(params).toString()}`),
  listTherapists:   (params?: Record<string, string>) =>
    req<any>(`/therapists${params ? '?' + new URLSearchParams(params) : ''}`),
  getTherapist:     (id: string) => req<any>(`/therapists/${id}`),

  // Bookings
  createBooking:  (data: any) =>
    req<any>('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  myBookings:     (status?: string) =>
    req<any>(`/bookings${status ? `?status=${status}` : ''}`),
  getBooking:     (id: string) => req<any>(`/bookings/${id}`),
  cancelBooking:  (id: string) =>
    req<any>(`/bookings/${id}/cancel`, { method: 'PUT' }),
  payBalance:     (id: string, mpesa_phone: string) =>
    req<any>(`/bookings/${id}/pay-balance`, { method: 'POST', body: JSON.stringify({ mpesa_phone }) }),
  leaveReview:    (id: string, data: { rating: number; comment: string; is_anonymous: boolean }) =>
    req<any>(`/bookings/${id}/review`, { method: 'POST', body: JSON.stringify(data) }),

  // Payments
  initiateMpesa:  (data: any) =>
    req<any>('/payments/mpesa/initiate', { method: 'POST', body: JSON.stringify(data) }),
  simulatePayment:(booking_id: string) =>
    req<any>(`/payments/simulate/${booking_id}`, { method: 'POST' }),

  // Notifications
  notifications:      (unread_only?: boolean) =>
    req<any>(`/notifications${unread_only ? '?unread=true' : ''}`),
  markRead:           (id: string) =>
    req<any>(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead:        () =>
    req<any>('/notifications/all/read', { method: 'PUT' }),

  // Disputes
  fileDispute:    (data: any) =>
    req<any>('/disputes', { method: 'POST', body: JSON.stringify(data) }),
  myDisputes:     () => req<any>('/disputes/mine'),

  // Consent
  consentAgreements: () => req<any>('/consent/agreements'),
  acceptConsent:     (agreements: string[]) =>
    req<any>('/consent', { method: 'POST', body: JSON.stringify({ agreements }) }),
  consentStatus:     () => req<any>('/consent/status'),

  // Emergency Resources
  emergencyResources: (country = 'Kenya') =>
    req<any>(`/emergency-resources?country=${country}`),

  // Cancellation Policy (used in booking flow)
  cancellationPolicy: () => req<any>('/admin/cancellation-policy'),
};