import { useState, useEffect } from 'react';

function CandidateRanking() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('all');
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]');
        setJobs(storedJobs);
        setApplications(allApps);
    }, []);

    const updateStatus = (appId, newStatus) => {
        const updated = applications.map(a =>
            a.id === appId ? { ...a, status: newStatus } : a
        );
        setApplications(updated);
        localStorage.setItem('allApplications', JSON.stringify(updated));

        // Also update per-candidate storage
        const byCandidate = {};
        updated.forEach(a => {
            if (!byCandidate[a.candidateId]) byCandidate[a.candidateId] = [];
            byCandidate[a.candidateId].push(a);
        });
        Object.entries(byCandidate).forEach(([cid, apps]) => {
            localStorage.setItem(`applications_${cid}`, JSON.stringify(apps));
        });
    };

    const filtered = applications
        .filter(a => selectedJob === 'all' || a.jobId === selectedJob)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    const badgeClass = score => score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    return (
        <div className="dash-section">
            <div className="dash-section-header">
                <div className="dash-section-title">
                    <span className="dash-section-title-icon">👥</span>
                    Candidate Rankings
                </div>
                <span className="dash-section-count">{filtered.length} candidates</span>
            </div>

            {/* Job filter */}
            <div style={{ marginBottom: 20 }}>
                <select
                    className="dk-field-select"
                    style={{ width: 'auto', minWidth: 220 }}
                    value={selectedJob}
                    onChange={e => setSelectedJob(e.target.value)}
                >
                    <option value="all">All job postings</option>
                    {jobs.map(j => (
                        <option key={j.id} value={j.id}>{j.title}</option>
                    ))}
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="dash-empty">
                    <span className="dash-empty-icon">👤</span>
                    No candidates found for this selection.
                </div>
            ) : (
                filtered.map((app, index) => (
                    <div key={app.id} className="dk-candidate-card">
                        {/* Rank badge */}
                        <div className={`dk-rank-badge ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>
                            #{index + 1}
                        </div>

                        {/* Info */}
                        <div className="dk-candidate-info">
                            <div className="dk-candidate-name">{app.candidateName}</div>
                            <div className="dk-candidate-email">{app.candidateEmail}</div>
                            <div className="dk-candidate-meta">
                                {app.jobTitle} · Applied {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                            {app.candidateSkills?.length > 0 && (
                                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    {app.candidateSkills.slice(0, 5).map((s, i) => (
                                        <span key={i} className="dk-skill-chip" style={{ fontSize: 10.5, padding: '3px 8px' }}>{s}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Match score */}
                        <span className={`dk-match-badge dk-match-${badgeClass(app.matchScore || 0)}`} style={{ flexShrink: 0 }}>
                            🎯 {app.matchScore || 0}%
                        </span>

                        {/* Status control */}
                        <select
                            className="dk-field-select"
                            style={{ width: 'auto', minWidth: 140 }}
                            value={app.status}
                            onChange={e => updateStatus(app.id, e.target.value)}
                        >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                ))
            )}
        </div>
    );
}

export default CandidateRanking;
