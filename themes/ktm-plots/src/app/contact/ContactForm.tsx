'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitLead } from '@/lib/cms';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: { name: string; email: string; phone: string; message: string }): FieldErrors {
  const errs: FieldErrors = {};
  if (!form.name.trim()) errs.name = 'Name is required.';
  else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
  if (!form.email.trim()) errs.email = 'Email is required.';
  else if (!EMAIL_RE.test(form.email)) errs.email = 'Enter a valid email address.';
  if (!form.message.trim()) errs.message = 'Message is required.';
  else if (form.message.trim().length < 10) errs.message = 'Message is too short (min 10 characters).';
  return errs;
}

export default function ContactForm() {
  const searchParams = useSearchParams();
  const plotSlug = searchParams.get('plot');

  const [status, setStatus]       = useState<Status>('idle');
  const [errorMsg, setErrorMsg]   = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched]     = useState<Record<string, boolean>>({});
  const [form, setForm]           = useState({ name: '', email: '', phone: '', message: '' });
  const successRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (plotSlug) {
      const plotName = plotSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      setForm((prev) => ({ ...prev, message: `I am interested in the plot: ${plotName}. Please contact me with more details.` }));
    }
  }, [plotSlug]);

  // Scroll to success message when it appears
  useEffect(() => {
    if (status === 'success') successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Live re-validate only fields the user has already touched
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: errs[name as keyof FieldErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(form);
    setFieldErrors((prev) => ({ ...prev, [name]: errs[name as keyof FieldErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields and mark all as touched
    const errs = validate(form);
    setFieldErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    const source = plotSlug ? `plot-enquiry:${plotSlug}` : 'contact-page';
    const result = await submitLead({ ...form, source });
    if (result.success) {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
      setTouched({});
      setFieldErrors({});
    } else {
      setStatus('error');
      setErrorMsg(result.message || 'Something went wrong. Please try again.');
    }
  };

  // ── Shared style helpers ──
  const fieldBorder = (field: keyof FieldErrors) =>
    touched[field] && fieldErrors[field] ? '#EF4444' : '#E5E7EB';

  const inputStyle = (field: keyof FieldErrors): React.CSSProperties => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1.5px solid ${fieldBorder(field)}`,
    borderRadius: '8px',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#FFFFFF',
    color: '#111827',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.825rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.4rem',
  };

  const helperStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: '#EF4444',
    marginTop: '0.3rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  // ── Success state ──
  if (status === 'success') {
    return (
      <div ref={successRef} style={{
        background: '#FFFFFF', borderRadius: '16px', padding: '3rem 2rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)', textAlign: 'center',
        animation: 'fadeIn 0.5s ease both',
      }}>
        {/* Animated tick */}
        <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 1.5rem' }}>
          <svg viewBox="0 0 72 72" width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke="#F3F4F6" strokeWidth="4" />
            <circle cx="36" cy="36" r="30" fill="none" stroke="var(--color-primary)" strokeWidth="4"
              strokeDasharray="188.5" strokeDashoffset="0"
              style={{ animation: 'dashReveal 0.6s ease-out both' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" fill="none" stroke="var(--color-primary)" strokeWidth="3" viewBox="0 0 24 24"
              style={{ animation: 'fadeIn 0.4s 0.5s ease both', opacity: 0 }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <h3 style={{ fontWeight: 800, color: 'var(--color-secondary)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
          Message Sent!
        </h3>
        <p style={{ color: '#6B7280', marginBottom: '2rem', lineHeight: 1.7 }}>
          Thank you for reaching out. Our team will contact you within 24 hours.
        </p>
        <button onClick={() => setStatus('idle')} className="btn-outline-dark" style={{ cursor: 'pointer' }}>
          Send Another Message
        </button>
        <style>{`
          @keyframes dashReveal {
            from { stroke-dashoffset: 188.5; }
            to   { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <h3 style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.25rem', marginBottom: '0.25rem' }}>Send Us a Message</h3>
      <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        We typically reply within a few hours during business days.
      </p>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Name + Phone row */}
        <div className="contact-name-phone-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label htmlFor="name" style={labelStyle}>
              Full Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              id="name" name="name" type="text"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              placeholder="Your full name"
              style={inputStyle('name')}
              aria-invalid={!!fieldErrors.name}
              aria-describedby={fieldErrors.name ? 'name-err' : undefined}
            />
            {touched.name && fieldErrors.name && (
              <div id="name-err" style={helperStyle} role="alert">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {fieldErrors.name}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="phone" style={labelStyle}>Phone Number</label>
            <input
              id="phone" name="phone" type="tel"
              value={form.phone}
              onChange={handleChange}
              onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; }}
              placeholder="+977 98XXXXXXXX"
              style={inputStyle('name' /* no validation */)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email Address <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            id="email" name="email" type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            placeholder="you@example.com"
            style={inputStyle('email')}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-err' : undefined}
          />
          {touched.email && fieldErrors.email && (
            <div id="email-err" style={helperStyle} role="alert">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {fieldErrors.email}
            </div>
          )}
        </div>

        {/* Message */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
            <label htmlFor="message" style={{ ...labelStyle, marginBottom: 0 }}>
              Message <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <span style={{ fontSize: '0.72rem', color: form.message.length > 900 ? '#EF4444' : '#9CA3AF' }}>
              {form.message.length}/1000
            </span>
          </div>
          <textarea
            id="message" name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; }}
            maxLength={1000}
            placeholder="Tell us what you're looking for — location preferences, budget, plot size, etc."
            style={{ ...inputStyle('message'), resize: 'vertical', minHeight: '120px' }}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? 'msg-err' : undefined}
          />
          {touched.message && fieldErrors.message && (
            <div id="msg-err" style={helperStyle} role="alert">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              {fieldErrors.message}
            </div>
          )}
        </div>

        {/* Server error banner */}
        {status === 'error' && (
          <div role="alert" style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '0.75rem 1rem', color: '#991B1B', fontSize: '0.875rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" style={{ flexShrink: 0, marginTop: '1px' }}><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary"
          style={{
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            opacity: status === 'loading' ? 0.75 : 1,
            textAlign: 'center',
            fontSize: '1rem',
            padding: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          {status === 'loading' ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ animation: 'spin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Sending…
            </>
          ) : (
            <>
              Send Message
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
