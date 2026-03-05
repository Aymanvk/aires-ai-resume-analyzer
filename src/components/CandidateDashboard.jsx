import { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import MetricCard from './MetricCard';
import ResumeUpload from './ResumeUpload';
import ResumeInsights from './ResumeInsights';
import JobList from './JobList';

const CANDIDATE_NAV = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'resume', icon: '📄', label: 'Resume Analysis' },
    { id: 'jobs', icon: '💼', label: 'Job Matches' },
    { id: 'applications', icon: '📋', label: 'My Applications' },
];

function CandidateDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [resumeData, setResumeData] = useState(null);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const storedResume = localStorage.getItem(`resume_${user.id}`);
        if (storedResume) setResumeData(JSON.parse(storedResume));
        const storedApps = JSON.parse(localStorage.getItem(`applications_${user.id}`) || '[]');
        setApplications(storedApps);
    }, [user.id]);

    // Reload applications whenever tab changes to "applications"
    useEffect(() => {
        if (activeTab === 'applications') {
            const storedApps = JSON.parse(localStorage.getItem(`applications_${user.id}`) || '[]');
            setApplications(storedApps);
        }
    }, [activeTab, user.id]);

    const handleUploadComplete = (data) => {
        setResumeData(data);
    };

    const candidateSkills = resumeData?.parsedData?.skills || [];
    const profilePct = resumeData ? 100 : 20;
    const resumeScore = resumeData ? 85 : 0;
    const jobsMatched = (() => {
        if (!resumeData) return 0;
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const skills = candidateSkills.map(s => s.toLowerCase());
        return jobs.filter(j =>
            j.requiredSkills.some(r =>
                skills.some(s => s.includes(r.toLowerCase()) || r.toLowerCase().includes(s))
            )
        ).length;
    })();

    return (
        <DashboardLayout
            user={user}
            onLogout={onLogout}
            navItems={CANDIDATE_NAV.map(n =>
                n.id === 'applications' ? { ...n, badge: applications.length || undefined } : n
            )}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >
            {/* ── Hero ── */}
            <div className="dash-hero">
                <div className="dash-hero-left">
                    <div className="dash-hero-eyebrow">AI Recruitment Suite</div>
                    <h1 className="dash-hero-title">
                        Welcome back, <span className="gradient-word">{user.name?.split(' ')[0]}</span>
                    </h1>
                    <p className="dash-hero-sub">
                        {resumeData
                            ? `Your profile is ready. ${jobsMatched} job${jobsMatched !== 1 ? 's' : ''} match your skills.`
                            : 'Upload your resume to unlock AI-powered job matches and insights.'}
                    </p>
                    {/* Strength bar */}
                    <div className="dash-strength-wrap" style={{ marginTop: 16 }}>
                        <span className="dash-strength-label">Profile strength</span>
                        <div className="dash-strength-bar">
                            <div className="dash-strength-fill" style={{ width: `${profilePct}%` }} />
                        </div>
                        <span className="dash-strength-pct">{profilePct}%</span>
                    </div>
                </div>
                <div className="dash-hero-actions">
                    <button className="dash-hero-btn-primary" onClick={() => setActiveTab('resume')}>
                        <span>📄</span> {resumeData ? 'Update Resume' : 'Upload Resume'}
                    </button>
                    <button className="dash-hero-btn-ghost" onClick={() => setActiveTab('jobs')}>
                        <span>💼</span> Browse Jobs
                    </button>
                </div>
            </div>

            {/* ── Metric cards ── */}
            <div className="metric-grid">
                <MetricCard
                    icon="🤖"
                    value={resumeScore ? `${resumeScore}%` : '—'}
                    label="Resume Score"
                    sub={resumeData ? 'AI-analysed' : 'Upload resume'}
                    glowColor="radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.2))"
                    trendLabel="Good"
                    trend={resumeData ? 1 : undefined}
                />
                <MetricCard
                    icon="💼"
                    value={jobsMatched}
                    label="Jobs Matched"
                    sub="Based on your skills"
                    glowColor="radial-gradient(circle, rgba(52,211,153,0.45) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(52,211,153,0.2),rgba(16,185,129,0.12))"
                    trendLabel="Live"
                    trend={jobsMatched > 0 ? 1 : undefined}
                />
                <MetricCard
                    icon="📬"
                    value={applications.length}
                    label="Applications Sent"
                    sub="Across all positions"
                    glowColor="radial-gradient(circle, rgba(251,191,36,0.4) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(251,191,36,0.18),rgba(245,158,11,0.12))"
                />
                <MetricCard
                    icon="👤"
                    value={`${profilePct}%`}
                    label="Profile Completion"
                    sub={profilePct < 100 ? 'Upload resume to complete' : 'All done!'}
                    glowColor="radial-gradient(circle, rgba(139,92,246,0.45) 0%, transparent 70%)"
                    iconBg="linear-gradient(135deg,rgba(139,92,246,0.22),rgba(99,102,241,0.15))"
                />
            </div>

            {/* ── Tab content ── */}
            <div className="dash-content-wrapper">

                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="dk-fade-up">
                        {!resumeData ? (
                            <div className="dash-section">
                                <div className="dash-empty">
                                    <span className="dash-empty-icon">🚀</span>
                                    <strong style={{ color: '#94a3b8' }}>Get started with AIRES</strong>
                                    <span>Upload your resume to unlock AI-powered job matches and skill insights.</span>
                                    <button className="dk-btn-primary" style={{ marginTop: 8 }} onClick={() => setActiveTab('resume')}>
                                        Upload Resume →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="dash-section">
                                    <div className="dash-section-header">
                                        <div className="dash-section-title">
                                            <span className="dash-section-title-icon">⚡</span>
                                            Quick Actions
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                        <button className="dk-btn-primary" onClick={() => setActiveTab('jobs')}>💼 Browse Job Matches</button>
                                        <button className="dk-btn-ghost" onClick={() => setActiveTab('applications')}>📋 Track Applications</button>
                                        <button className="dk-btn-ghost" onClick={() => setActiveTab('resume')}>📄 View Insights</button>
                                    </div>
                                </div>

                                {/* Recent applications */}
                                <div className="dash-section">
                                    <div className="dash-section-header">
                                        <div className="dash-section-title">
                                            <span className="dash-section-title-icon">📋</span>
                                            Recent Applications
                                        </div>
                                        <span className="dash-section-count">{applications.length}</span>
                                    </div>
                                    {applications.length === 0 ? (
                                        <div className="dash-empty">
                                            <span className="dash-empty-icon">📭</span>
                                            You haven't applied to any jobs yet.
                                        </div>
                                    ) : (
                                        applications.slice(0, 3).map(app => (
                                            <div key={app.id} className="dk-job-card">
                                                <div className="dk-job-card-header">
                                                    <div>
                                                        <div className="dk-job-title">{app.jobTitle}</div>
                                                        <div className="dk-job-id">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                                                    </div>
                                                    <span className={`dk-status-badge dk-status-${app.status.toLowerCase()}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <span className={`dk-match-badge dk-match-${app.matchScore >= 70 ? 'high' : app.matchScore >= 40 ? 'medium' : 'low'}`}>
                                                    🎯 {app.matchScore}% match
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* RESUME ANALYSIS */}
                {activeTab === 'resume' && (
                    <div className="dk-fade-up">
                        <ResumeUpload user={user} onUploadComplete={handleUploadComplete} />
                        <ResumeInsights resumeData={resumeData} />
                    </div>
                )}

                {/* JOB MATCHES */}
                {activeTab === 'jobs' && (
                    <div className="dk-fade-up">
                        <JobList user={user} candidateSkills={candidateSkills} />
                    </div>
                )}

                {/* MY APPLICATIONS */}
                {activeTab === 'applications' && (
                    <div className="dk-fade-up">
                        <div className="dash-section">
                            <div className="dash-section-header">
                                <div className="dash-section-title">
                                    <span className="dash-section-title-icon">📋</span>
                                    My Applications
                                </div>
                                <span className="dash-section-count">{applications.length}</span>
                            </div>
                            {applications.length === 0 ? (
                                <div className="dash-empty">
                                    <span className="dash-empty-icon">📭</span>
                                    No applications yet. Browse job matches and apply!
                                    <button className="dk-btn-primary" style={{ marginTop: 8 }} onClick={() => setActiveTab('jobs')}>
                                        Browse Jobs →
                                    </button>
                                </div>
                            ) : (
                                applications.map(app => (
                                    <div key={app.id} className="dk-job-card">
                                        <div className="dk-job-card-header">
                                            <div>
                                                <div className="dk-job-title">{app.jobTitle}</div>
                                                <div className="dk-job-id">Applied on {new Date(app.appliedAt).toLocaleString()}</div>
                                            </div>
                                            <span className={`dk-status-badge dk-status-${app.status.toLowerCase()}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <span className={`dk-match-badge dk-match-${app.matchScore >= 70 ? 'high' : app.matchScore >= 40 ? 'medium' : 'low'}`}>
                                            🎯 {app.matchScore}% match
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default CandidateDashboard;
