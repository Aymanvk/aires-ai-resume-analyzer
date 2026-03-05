import { useState, useEffect } from 'react';
import './dashboard.css';

/**
 * DashboardLayout — shared wrapper for Candidate & Recruiter dashboards.
 * Provides: dark background (blobs + dot grid), fixed sidebar, main area.
 * Props: user, onLogout, navItems[{id,icon,label}], activeTab, onTabChange, role
 */
function DashboardLayout({ user, onLogout, navItems, activeTab, onTabChange, children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 30);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="dash-root">
            {/* Animated background */}
            <div className="dash-blob dash-blob-1" />
            <div className="dash-blob dash-blob-2" />
            <div className="dash-blob dash-blob-3" />
            <div className="dash-dot-grid" />

            {/* ── Sidebar ── */}
            <aside className={`dash-sidebar ${mounted ? 'mounted' : ''}`}>
                {/* Logo */}
                <div className="dash-logo-area">
                    <div className="dash-logo-icon">⬡</div>
                    <div>
                        <div className="dash-logo-text">AIRES</div>
                        <div className="dash-logo-sub">AI Recruitment Suite</div>
                    </div>
                </div>

                {/* Nav items */}
                <nav className="dash-nav">
                    {navItems.map((item, i) => (
                        <button
                            key={item.id}
                            className={`dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
                            style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                        >
                            <span className="dash-nav-icon">{item.icon}</span>
                            <span className="dash-nav-label">{item.label}</span>
                            {item.badge != null && (
                                <span className="dash-nav-badge">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* User footer */}
                <div className="dash-sidebar-footer">
                    <div className="dash-user-avatar">
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="dash-user-meta">
                        <div className="dash-user-name">{user?.name || 'User'}</div>
                        <div className="dash-user-role">{user?.role || ''}</div>
                    </div>
                    <button
                        className="dash-logout-btn"
                        onClick={onLogout}
                        title="Sign out"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <main className={`dash-main ${mounted ? 'mounted' : ''}`}>
                {children}
            </main>
        </div>
    );
}

export default DashboardLayout;
