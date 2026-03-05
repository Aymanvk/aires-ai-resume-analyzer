import { useState, useEffect } from 'react';

function Analytics() {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        shortlisted: 0,
        rejected: 0,
        avgMatch: 0,
    });

    useEffect(() => {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const applications = JSON.parse(localStorage.getItem('allApplications') || '[]');
        const shortlisted = applications.filter(a => a.status === 'Shortlisted').length;
        const rejected = applications.filter(a => a.status === 'Rejected').length;
        const avgMatch = applications.length
            ? Math.round(applications.reduce((s, a) => s + (a.matchScore || 0), 0) / applications.length)
            : 0;

        setStats({ totalJobs: jobs.length, totalApplicants: applications.length, shortlisted, rejected, avgMatch });
    }, []);

    const pending = stats.totalApplicants - stats.shortlisted - stats.rejected;
    const shortlistRate = stats.totalApplicants > 0
        ? Math.round((stats.shortlisted / stats.totalApplicants) * 100)
        : 0;
    const avgPerJob = stats.totalJobs > 0
        ? (stats.totalApplicants / stats.totalJobs).toFixed(1)
        : '0';

    // Bar chart data
    const bars = [
        { label: 'Applied', value: stats.totalApplicants - stats.shortlisted - stats.rejected, color: 'linear-gradient(90deg,#6366f1,#818cf8)', max: stats.totalApplicants },
        { label: 'Shortlisted', value: stats.shortlisted, color: 'linear-gradient(90deg,#34d399,#10b981)', max: stats.totalApplicants },
        { label: 'Rejected', value: stats.rejected, color: 'linear-gradient(90deg,#f87171,#ef4444)', max: stats.totalApplicants },
    ];

    return (
        <>
            {/* Insights panels */}
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <span className="dash-section-title-icon">📊</span>
                        Recruitment Overview
                    </div>
                </div>

                <div className="dk-analytics-grid">
                    {/* Key metrics */}
                    <div className="dk-insights-panel">
                        <div className="dk-insights-panel-title">📈 Pipeline Metrics</div>
                        <div className="dk-insight-row">
                            <span className="dk-insight-key">Avg. applications / job</span>
                            <span className="dk-insight-val">{avgPerJob}</span>
                        </div>
                        <div className="dk-insight-row">
                            <span className="dk-insight-key">Shortlist rate</span>
                            <span className="dk-insight-val">{shortlistRate}%</span>
                        </div>
                        <div className="dk-insight-row">
                            <span className="dk-insight-key">Avg. match score</span>
                            <span className="dk-insight-val">{stats.avgMatch}%</span>
                        </div>
                        <div className="dk-insight-row">
                            <span className="dk-insight-key">Pending review</span>
                            <span className="dk-insight-val">{pending}</span>
                        </div>
                    </div>

                    {/* Application funnel bar chart */}
                    <div className="dk-insights-panel">
                        <div className="dk-insights-panel-title">🎯 Application Funnel</div>
                        {stats.totalApplicants === 0 ? (
                            <div className="dash-empty" style={{ padding: '24px 0' }}>
                                <span className="dash-empty-icon">📭</span>
                                No applications yet
                            </div>
                        ) : (
                            <div className="dk-bar-chart">
                                {bars.map(b => (
                                    <div key={b.label} className="dk-bar-row">
                                        <span className="dk-bar-label">{b.label}</span>
                                        <div className="dk-bar-track">
                                            <div
                                                className="dk-bar-fill"
                                                style={{
                                                    width: b.max > 0 ? `${Math.round((b.value / b.max) * 100)}%` : '0%',
                                                    background: b.color,
                                                }}
                                            />
                                        </div>
                                        <span className="dk-bar-val">{b.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick tips */}
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <span className="dash-section-title-icon">💡</span>
                        Quick Insights
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {[
                        { key: 'Active job postings', val: stats.totalJobs },
                        { key: 'Total applications received', val: stats.totalApplicants },
                        { key: 'Candidates shortlisted', val: stats.shortlisted },
                        { key: 'Candidates rejected', val: stats.rejected },
                        { key: 'Average match score', val: `${stats.avgMatch}%` },
                    ].map(r => (
                        <div key={r.key} className="dk-insight-row">
                            <span className="dk-insight-key">{r.key}</span>
                            <span className="dk-insight-val">{r.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Analytics;
