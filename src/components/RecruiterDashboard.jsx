import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import MetricCard from './MetricCard';
import JobPost from './JobPost';
import CandidateRanking from './CandidateRanking';
import Analytics from './Analytics';

const RECRUITER_NAV = [
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'jobs', icon: '📝', label: 'Job Management' },
    { id: 'candidates', icon: '👥', label: 'Candidates' },
];

function RecruiterDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('analytics');

    // Compute quick stats for hero metric cards
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]');
    const shortlisted = allApps.filter(a => a.status === 'Shortlisted').length;
    const pending = allApps.filter(a => a.status === 'Applied').length;

    return (
        <DashboardLayout
            user={user}
            onLogout={onLogout}
            navItems={RECRUITER_NAV.map(n =>
                n.id === 'candidates' ? { ...n, badge: allApps.length || undefined } : n
            )}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {/* ── Hero ── */}
            <div className="dash-hero">
                <div className="dash-hero-left">
                    <div className="dash-hero-eyebrow">Recruiter Dashboard</div>
                    <h1 className="dash-hero-title">
                        Welcome back, <span className="gradient-word">{user.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="dash-hero-sub">
                        {jobs.length} active job posting{jobs.length !== 1 ? 's' : ''} · {allApps.length} total application{allApps.length !== 1 ? 's' : ''} received.
                    </p>
                </div>
                <div className="dash-hero-actions">
                    <button className="dash-hero-btn-primary" onClick={() => setActiveTab('jobs')}>
                        <span>+</span> Post New Job
                    </button>
                    <button className="dash-hero-btn-ghost" onClick={() => setActiveTab('candidates')}>
                        <span>👥</span> View Candidates
                    </button>
                </div>
            </div>

            {/* ── Metric cards ── */}
            <div className="metric-grid">
                <MetricCard
                    icon="📝"
                    value={jobs.length}
                    label="Active Jobs"
                    sub="Posted positions"
                    glowColor="radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2))"
                />
                <MetricCard
                    icon="📬"
                    value={allApps.length}
                    label="Total Applicants"
                    sub="All submissions"
                    glowColor="radial-gradient(circle, rgba(52,211,153,0.45) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(52,211,153,0.2),rgba(16,185,129,0.12))"
                />
                <MetricCard
                    icon="✅"
                    value={shortlisted}
                    label="Shortlisted"
                    sub="Ready to interview"
                    glowColor="radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(251,191,36,0.2),rgba(245,158,11,0.12))"
                    trendLabel={allApps.length > 0 ? `${Math.round((shortlisted / allApps.length) * 100)}%` : '0%'}
                    trend={shortlisted > 0 ? 1 : undefined}
                />
                <MetricCard
                    icon="⏳"
                    value={pending}
                    label="Pending Review"
                    sub="Awaiting decision"
                    glowColor="radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(139,92,246,0.22),rgba(99,102,241,0.15))"
                />
            </div>

            {/* ── Tab content ── */}
            <div className="dash-content-wrapper">
                {activeTab === 'analytics' && <div className="dk-fade-up"><Analytics /></div>}
                {activeTab === 'jobs' && <div className="dk-fade-up"><JobPost /></div>}
                {activeTab === 'candidates' && <div className="dk-fade-up"><CandidateRanking /></div>}
            </div>
        </DashboardLayout>
    );
}

export default RecruiterDashboard;
