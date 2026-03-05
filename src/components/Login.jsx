import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const FEATURES = [
    { icon: '🧠', text: 'AI-powered resume scoring & ATS analysis' },
    { icon: '🎯', text: 'Skill gap detection and job matching' },
    { icon: '📊', text: 'Recruiter dashboard with candidate ranking' },
    { icon: '🔒', text: 'Secure auth — bcrypt + JWT tokens' },
];

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const onChange = e => {
        setForm(p => ({ ...p, [e.target.name]: e.target.value }));
        if (error) setError('');
    };

    const onSubmit = async e => {
        e.preventDefault();
        if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', {
                email: form.email,
                password: form.password,
            });
            // Store JWT for subsequent authenticated requests
            localStorage.setItem('token', data.token);
            onLogin(data.user);
            navigate(data.user.role === 'candidate' ? '/candidate-dashboard' : '/recruiter-dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .page-fade { animation: fadeUp .5s ease both; }
        .inp-field {
          width: 100%; background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1); border-radius: 8px;
          padding: 11px 16px 11px 43px; font-size: 15.5px; color: #e2e8f0;
          font-family: inherit; box-sizing: border-box;
          transition: border-color .18s, box-shadow .18s;
        }
        .inp-field::placeholder { color: #3f4f65; }
        .inp-field:hover  { border-color: rgba(255,255,255,.18); }
        .inp-field:focus  {
          outline: none; border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,.18);
          background: rgba(99,102,241,.06);
        }
        .sign-btn {
          width: 100%; padding: 12.5px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #fff; font-size: 15.5px; font-weight: 600; font-family: inherit;
          cursor: pointer; transition: opacity .15s, transform .15s;
          box-shadow: 0 4px 18px rgba(99,102,241,.35);
        }
        .sign-btn:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .sign-btn:disabled { opacity: .7; cursor: not-allowed; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin .7s linear infinite; }
      `}</style>

            {/* Full-viewport background */}
            <div style={{
                position: 'fixed', inset: 0,
                background: '#070c1a',
                backgroundImage: `
          radial-gradient(ellipse 60% 50% at 20% 40%, rgba(99,102,241,.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 70%, rgba(124,58,237,.10) 0%, transparent 60%),
          radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)
        `,
                backgroundSize: 'auto, auto, 28px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>

                {/* Content container — max 1260px, centered */}
                <div className="page-fade" style={{
                    width: '100%', maxWidth: 1260,
                    padding: '0 40px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 470px',
                    gap: 64,
                    alignItems: 'center',
                }}>

                    {/* ── LEFT: Branding ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

                        {/* Logo */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{
                                fontSize: 27, color: '#818cf8',
                                filter: 'drop-shadow(0 0 8px rgba(129,140,248,.6))'
                            }}>⬡</span>
                            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '.1em', color: '#e0e7ff' }}>
                                AIRES
                            </span>
                        </div>

                        {/* Headline */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <h1 style={{
                                fontSize: 'clamp(32px, 3.4vw, 45px)', fontWeight: 800,
                                lineHeight: 1.2, letterSpacing: '-0.03em',
                                color: '#f1f5f9', margin: 0,
                            }}>
                                Smarter hiring with{' '}
                                <span style={{
                                    background: 'linear-gradient(130deg, #818cf8, #a78bfa)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>AI-powered</span>{' '}
                                recruitment
                            </h1>
                            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.65, margin: 0, maxWidth: '52ch' }}>
                                From resume parsing to candidate ranking — AIRES handles your entire
                                recruitment pipeline intelligently.
                            </p>
                        </div>

                        {/* Feature list */}
                        <ul style={{
                            listStyle: 'none', padding: 0, margin: 0,
                            display: 'flex', flexDirection: 'column', gap: 10
                        }}>
                            {FEATURES.map(f => (
                                <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                                    <span style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.4 }}>{f.text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Social proof */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ display: 'flex' }}>
                                {['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'].map((c, i) => (
                                    <div key={i} style={{
                                        width: 29, height: 29, borderRadius: '50%',
                                        border: '2px solid #070c1a',
                                        background: `linear-gradient(135deg, ${c}, ${c}88)`,
                                        marginLeft: i === 0 ? 0 : -8,
                                    }} />
                                ))}
                            </div>
                            <span style={{ fontSize: 14, color: '#475569' }}>
                                Trusted by <span style={{ color: '#818cf8', fontWeight: 600 }}>2,400+</span> teams
                            </span>
                        </div>
                    </div>

                    {/* ── RIGHT: Login Card ── */}
                    <div style={{
                        background: 'rgba(10,14,32,.95)',
                        border: '1px solid rgba(255,255,255,.08)',
                        borderRadius: 16,
                        padding: '36px 31px',
                        boxShadow: '0 24px 64px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)',
                    }}>

                        {/* Card header */}
                        <div style={{ marginBottom: 24 }}>
                            <h2 style={{
                                fontSize: 20, fontWeight: 700, color: '#f1f5f9',
                                letterSpacing: '-0.02em', margin: '0 0 4px'
                            }}>
                                Sign in to AIRES
                            </h2>
                            <p style={{ fontSize: 14.5, color: '#475569', margin: 0 }}>
                                Enter your credentials to continue
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
                                padding: '11px 13px', borderRadius: 8, fontSize: 14.5, color: '#fca5a5',
                                background: 'rgba(239,68,68,.09)', border: '1px solid rgba(239,68,68,.2)',
                            }}>
                                <span>⚠</span>{error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                            {/* Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="l-email" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%',
                                        transform: 'translateY(-50%)', color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input id="l-email" type="email" name="email" value={form.email}
                                        onChange={onChange} placeholder="you@company.com" autoComplete="email"
                                        className="inp-field" />
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="l-pw" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%',
                                        transform: 'translateY(-50%)', color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input id="l-pw" type={showPw ? 'text' : 'password'} name="password"
                                        value={form.password} onChange={onChange}
                                        placeholder="Your password" autoComplete="current-password"
                                        className="inp-field" style={{ paddingRight: 38 }} />
                                    <button type="button" onClick={() => setShowPw(v => !v)}
                                        style={{
                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                            color: '#334155', display: 'flex', alignItems: 'center',
                                            transition: 'color .15s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
                                        {showPw
                                            ? <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                                            : <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading} className="sign-btn" style={{ marginTop: 4 }}>
                                {loading
                                    ? <span className="spin" style={{
                                        width: 16, height: 16, borderRadius: '50%',
                                        display: 'inline-block', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff'
                                    }} />
                                    : 'Sign in →'
                                }
                            </button>
                        </form>

                        {/* Footer */}
                        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14.5, color: '#334155' }}>
                            No account?{' '}
                            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}>
                                Create one
                            </Link>
                        </p>
                        <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12.5, color: '#1e293b' }}>
                            🔒 bcrypt · JWT · HTTPS
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
