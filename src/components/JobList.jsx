import { useState, useEffect } from 'react';

function JobList({ user, candidateSkills }) {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [applications, setApplications] = useState([]);
    const [applying, setApplying] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        setJobs(storedJobs);
        const storedApps = JSON.parse(localStorage.getItem(`applications_${user.id}`) || '[]');
        setApplications(storedApps);
    }, [user.id]);

    const calcMatchScore = (requiredSkills) => {
        if (!candidateSkills?.length || !requiredSkills?.length) return 0;
        const norm = s => s.toLowerCase().trim();
        const matched = requiredSkills.filter(req =>
            candidateSkills.some(cs =>
                norm(cs).includes(norm(req)) || norm(req).includes(norm(cs))
            )
        );
        return Math.round((matched.length / requiredSkills.length) * 100);
    };

    const getSkillGap = (requiredSkills) => {
        if (!candidateSkills?.length) return requiredSkills || [];
        const norm = s => s.toLowerCase().trim();
        return (requiredSkills || []).filter(req =>
            !candidateSkills.some(cs =>
                norm(cs).includes(norm(req)) || norm(req).includes(norm(cs))
            )
        );
    };

    const hasApplied = (jobId) => applications.some(a => a.jobId === jobId);

    const applyToJob = (job, matchScore) => {
        if (hasApplied(job.id)) return;
        setApplying(job.id);
        setTimeout(() => {
            const newApp = {
                id: Date.now().toString(),
                jobId: job.id,
                jobTitle: job.title,
                candidateId: user.id,
                candidateName: user.name,
                candidateEmail: user.email,
                candidateSkills: candidateSkills,
                appliedAt: new Date().toISOString(),
                status: 'Applied',
                matchScore,
            };
            const updatedApps = [...applications, newApp];
            setApplications(updatedApps);
            localStorage.setItem(`applications_${user.id}`, JSON.stringify(updatedApps));

            // Global applications store for recruiter
            const allApps = JSON.parse(localStorage.getItem('allApplications') || '[]');
            localStorage.setItem('allApplications', JSON.stringify([...allApps, newApp]));

            setMessage(`Successfully applied to "${job.title}"!`);
            setTimeout(() => setMessage(''), 3000);
            setApplying(null);
        }, 800);
    };

    // Computed jobs list
    const jobsWithScores = jobs.map(j => ({
        ...j,
        matchScore: calcMatchScore(j.requiredSkills),
        skillGap: getSkillGap(j.requiredSkills),
    }));

    const filtered = jobsWithScores
        .filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(j => {
            if (filter === 'high') return j.matchScore >= 70;
            if (filter === 'medium') return j.matchScore >= 40 && j.matchScore < 70;
            if (filter === 'low') return j.matchScore < 40;
            return true;
        })
        .sort((a, b) => b.matchScore - a.matchScore);

    const badgeClass = score => score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';

    return (
        <div className="dash-section">
            <div className="dash-section-header">
                <div className="dash-section-title">
                    <span className="dash-section-title-icon">💼</span>
                    Job Matches
                </div>
                <span className="dash-section-count">{filtered.length} results</span>
            </div>

            {message && <div className="dk-success">✅ {message}</div>}

            {!candidateSkills?.length && (
                <div className="dk-ai-badge" style={{ marginBottom: 16 }}>
                    <span>💡</span>
                    Upload your resume to see personalised match scores for each job.
                </div>
            )}

            {/* Search & filter */}
            <div className="dk-search-row">
                <div className="dk-search-wrap">
                    <span className="dk-search-icon">🔍</span>
                    <input
                        className="dk-search-input"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="dk-field-select"
                    style={{ width: 'auto', minWidth: 140 }}
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <option value="all">All matches</option>
                    <option value="high">High (70%+)</option>
                    <option value="medium">Medium (40–69%)</option>
                    <option value="low">Low (&lt;40%)</option>
                </select>
            </div>

            {/* Job cards */}
            {filtered.length === 0 ? (
                <div className="dash-empty">
                    <span className="dash-empty-icon">🔍</span>
                    No jobs found matching your criteria.
                </div>
            ) : (
                filtered.map(job => (
                    <div key={job.id} className="dk-job-card">
                        <div className="dk-job-card-header">
                            <div>
                                <div className="dk-job-title">{job.title}</div>
                                <div className="dk-job-id">ID: {job.id}</div>
                            </div>
                            {candidateSkills?.length > 0 && (
                                <span className={`dk-match-badge dk-match-${badgeClass(job.matchScore)}`}>
                                    🎯 {job.matchScore}% match
                                </span>
                            )}
                        </div>

                        {/* Required skills */}
                        <div className="dk-job-meta">
                            {(job.requiredSkills || []).map((skill, i) => (
                                <span key={i} className="dk-skill-chip">{skill}</span>
                            ))}
                        </div>

                        {/* Skill gap */}
                        {candidateSkills?.length > 0 && job.skillGap.length > 0 && (
                            <div className="dk-skill-gap">
                                <span style={{ fontWeight: 600 }}>Skills to develop: </span>
                                {job.skillGap.join(', ')}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="dk-job-footer">
                            <span style={{ fontSize: 12, color: '#475569' }}>
                                Posted {new Date(job.postedAt || Date.now()).toLocaleDateString()}
                            </span>
                            {hasApplied(job.id) ? (
                                <span className="dk-status-badge dk-status-applied">✓ Applied</span>
                            ) : (
                                <button
                                    className="dk-btn-primary"
                                    disabled={!candidateSkills?.length || applying === job.id}
                                    onClick={() => applyToJob(job, job.matchScore)}
                                    style={{ padding: '8px 18px', fontSize: 13 }}
                                >
                                    {applying === job.id
                                        ? <><span className="dk-spinner" /> Applying...</>
                                        : '🚀 Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default JobList;
