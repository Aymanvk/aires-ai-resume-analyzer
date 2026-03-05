import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'candidate' });
    const [error, setError] = useState('');
    const [ok, setOk] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const onChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); if (error) setError(''); };

    const onSubmit = async e => {
        e.preventDefault(); setError(''); setOk('');
        const { name, email, password, confirm, role } = form;
        if (!name || !email || !password || !confirm) { setError('All fields are required.'); return; }
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        if (!/[A-Z]/.test(password)) { setError('Password must contain at least one uppercase letter.'); return; }
        if (!/[0-9]/.test(password)) { setError('Password must contain at least one number.'); return; }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password, role });
            // Persist the JWT so subsequent protected requests are authenticated
            localStorage.setItem('token', data.token);
            setOk('Account created! Redirecting…');
            setTimeout(() => navigate('/login'), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const f = {
        width: '100%', background: 'rgba(255,255,255,.04)',
        border: '1px solid rgba(255,255,255,.1)', borderRadius: 8,
        padding: '11px 16px 11px 43px', fontSize: 15.5, color: '#e2e8f0',
        fontFamily: 'inherit', boxSizing: 'border-box',
    };

    return (
        <>
            <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .reg-fade { animation: fadeUp .5s ease both; }
        .r-inp { transition:border-color .18s,box-shadow .18s; }
        .r-inp::placeholder { color:#3f4f65; }
        .r-inp:hover  { border-color:rgba(255,255,255,.18)!important; }
        .r-inp:focus  { outline:none;border-color:#6366f1!important;background:rgba(99,102,241,.06)!important;box-shadow:0 0 0 3px rgba(99,102,241,.18)!important; }
        .reg-btn { transition:opacity .15s,transform .15s; }
        .reg-btn:hover:not(:disabled) { opacity:.9;transform:translateY(-1px); }
        .reg-btn:disabled { opacity:.7;cursor:not-allowed; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .reg-spin { animation:spin .7s linear infinite; }
      `}</style>

            {/* Full-viewport background */}
            <div style={{
                position: 'fixed', inset: 0, background: '#070c1a',
                backgroundImage: `
          radial-gradient(ellipse 60% 50% at 15% 40%,rgba(99,102,241,.12) 0%,transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 70%,rgba(124,58,237,.10) 0%,transparent 60%),
          radial-gradient(circle,rgba(255,255,255,.04) 1px,transparent 1px)
        `,
                backgroundSize: 'auto,auto,28px 28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>

                {/* Content container */}
                <div className="reg-fade" style={{
                    width: '100%', maxWidth: 1260, padding: '0 40px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 470px',
                    gap: 64,
                    alignItems: 'center',
                }}>

                    {/* LEFT — branding */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 27, color: '#818cf8', filter: 'drop-shadow(0 0 8px rgba(129,140,248,.6))' }}>⬡</span>
                            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '.1em', color: '#e0e7ff' }}>AIRES</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <h1 style={{
                                fontSize: 'clamp(32px,3.4vw,45px)', fontWeight: 800,
                                lineHeight: 1.2, letterSpacing: '-0.03em', color: '#f1f5f9', margin: 0,
                            }}>
                                Get started with{' '}
                                <span style={{
                                    background: 'linear-gradient(130deg,#818cf8,#a78bfa)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>AI recruitment</span>{' '}today
                            </h1>
                            <p style={{ fontSize: 17, color: '#64748b', lineHeight: 1.65, margin: 0, maxWidth: '52ch' }}>
                                Create your account and get AI-powered resume scoring, skill gap analysis,
                                and candidate matching — free to start.
                            </p>
                        </div>

                        {/* Onboarding checklist */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { n: '01', label: 'Create your account' },
                                { n: '02', label: 'Complete your profile' },
                                { n: '03', label: 'Start exploring AIRES' },
                            ].map((s, i) => (
                                <div key={s.n} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '10px 14px', borderRadius: 10,
                                    border: i === 0 ? '1px solid rgba(129,140,248,.25)' : '1px solid rgba(255,255,255,.05)',
                                    background: i === 0 ? 'rgba(99,102,241,.07)' : 'rgba(255,255,255,.02)',
                                }}>
                                    <span style={{
                                        width: 31, height: 31, borderRadius: 6, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, fontSize: 12, fontWeight: 700,
                                        background: i === 0 ? 'rgba(129,140,248,.18)' : 'rgba(255,255,255,.04)',
                                        color: i === 0 ? '#818cf8' : '#334155',
                                    }}>{s.n}</span>
                                    <span style={{
                                        fontSize: 15, fontWeight: 500,
                                        color: i === 0 ? '#c7d2fe' : '#334155'
                                    }}>{s.label}</span>
                                    {i === 0 && <span style={{
                                        marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
                                        background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,.8)', flexShrink: 0
                                    }} />}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['🔒 bcrypt encrypted', '⚡ Instant analysis', '🎯 Role-based access'].map(t => (
                                <span key={t} style={{
                                    padding: '5px 10px', borderRadius: 20, fontSize: 13,
                                    color: '#475569', border: '1px solid rgba(255,255,255,.06)',
                                    background: 'rgba(255,255,255,.02)',
                                }}>{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — Register card */}
                    <div style={{
                        background: 'rgba(10,14,32,.95)',
                        border: '1px solid rgba(255,255,255,.08)',
                        borderRadius: 16,
                        padding: '31px 29px',
                        boxShadow: '0 24px 64px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.06)',
                    }}>

                        <div style={{ marginBottom: 20 }}>
                            <h2 style={{
                                fontSize: 20, fontWeight: 700, color: '#f1f5f9',
                                letterSpacing: '-0.02em', margin: '0 0 4px'
                            }}>Create your account</h2>
                            <p style={{ fontSize: 14.5, color: '#475569', margin: 0 }}>Free forever for candidates</p>
                        </div>

                        {error && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                                padding: '10px 13px', borderRadius: 8, fontSize: 14.5, color: '#fca5a5',
                                background: 'rgba(239,68,68,.09)', border: '1px solid rgba(239,68,68,.2)'
                            }}>
                                <span>⚠</span>{error}
                            </div>
                        )}
                        {ok && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
                                padding: '10px 13px', borderRadius: 8, fontSize: 14.5, color: '#6ee7b7',
                                background: 'rgba(16,185,129,.09)', border: '1px solid rgba(16,185,129,.2)'
                            }}>
                                <span>✓</span>{ok}
                            </div>
                        )}

                        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                            {/* Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="rg-name" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Full name</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input id="rg-name" type="text" name="name" value={form.name} onChange={onChange}
                                        placeholder="Jane Smith" autoComplete="name" className="r-inp" style={f} />
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="rg-email" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input id="rg-email" type="email" name="email" value={form.email} onChange={onChange}
                                        placeholder="you@company.com" autoComplete="email" className="r-inp" style={f} />
                                </div>
                            </div>

                            {/* Role */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <span style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>I am a…</span>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {[{ v: 'candidate', label: '👤 Candidate' }, { v: 'recruiter', label: '🏢 Recruiter' }].map(r => (
                                        <button key={r.v} type="button" onClick={() => setForm(p => ({ ...p, role: r.v }))}
                                            style={{
                                                padding: '10px 8px', borderRadius: 8, fontSize: 14.5, fontWeight: 500,
                                                fontFamily: 'inherit', cursor: 'pointer', transition: 'all .18s',
                                                background: form.role === r.v ? 'rgba(99,102,241,.15)' : 'rgba(255,255,255,.04)',
                                                border: form.role === r.v ? '1px solid #818cf8' : '1px solid rgba(255,255,255,.09)',
                                                color: form.role === r.v ? '#c7d2fe' : '#475569',
                                            }}>{r.label}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="rg-pw" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input id="rg-pw" type={showPw ? 'text' : 'password'} name="password"
                                        value={form.password} onChange={onChange}
                                        placeholder="Min. 6 characters" autoComplete="new-password"
                                        className="r-inp" style={{ ...f, paddingRight: 38 }} />
                                    <button type="button" onClick={() => setShowPw(v => !v)}
                                        style={{
                                            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                                            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                                            color: '#334155', display: 'flex', alignItems: 'center', transition: 'color .15s'
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

                            {/* Confirm */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                                <label htmlFor="rg-confirm" style={{
                                    fontSize: 12, fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '.06em'
                                }}>Confirm password</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{
                                        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                        color: '#334155', display: 'flex', pointerEvents: 'none'
                                    }}>
                                        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input id="rg-confirm" type={showPw ? 'text' : 'password'} name="confirm"
                                        value={form.confirm} onChange={onChange}
                                        placeholder="Re-enter password" autoComplete="new-password"
                                        className="r-inp" style={f} />
                                </div>
                            </div>

                            {/* Submit */}
                            <button type="submit" disabled={loading} className="reg-btn"
                                style={{
                                    width: '100%', padding: '12.5px', borderRadius: 8, border: 'none',
                                    background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                                    color: '#fff', fontSize: 15.5, fontWeight: 600, fontFamily: 'inherit',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 18px rgba(99,102,241,.35)', marginTop: 4,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}>
                                {loading
                                    ? <span className="reg-spin" style={{
                                        width: 16, height: 16, borderRadius: '50%',
                                        display: 'inline-block', border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff'
                                    }} />
                                    : 'Create account →'}
                            </button>
                        </form>

                        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 14.5, color: '#334155' }}>
                            Have an account?{' '}
                            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                                onMouseLeave={e => e.currentTarget.style.color = '#818cf8'}>
                                Sign in
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
