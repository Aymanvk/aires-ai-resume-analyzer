function ResumeInsights({ resumeData }) {
    if (!resumeData || !resumeData.parsedData) {
        return (
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <span className="dash-section-title-icon">🤖</span>
                        AI Resume Insights
                    </div>
                </div>
                <div className="dash-empty">
                    <span className="dash-empty-icon">🤖</span>
                    Upload your resume above to see AI-powered insights
                </div>
            </div>
        );
    }

    const { parsedData } = resumeData;

    return (
        <div className="dash-section">
            <div className="dash-section-header">
                <div className="dash-section-title">
                    <span className="dash-section-title-icon">🤖</span>
                    AI Resume Insights
                </div>
                <span className="dash-section-count">
                    {resumeData.fileName}
                </span>
            </div>

            <div className="dk-ai-badge" style={{ marginBottom: 22 }}>
                <span>⚡</span>
                AI-Generated · Extracted via Natural Language Processing ·{' '}
                {new Date(resumeData.uploadedAt).toLocaleDateString()}
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 22 }}>
                <div className="dk-form-title">💼 Skills Detected</div>
                <div className="dk-skill-tags">
                    {parsedData.skills.map((skill, i) => (
                        <span key={i} className="dk-skill-tag">{skill}</span>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div style={{ marginBottom: 22 }}>
                <div className="dk-form-title">🎓 Education</div>
                {parsedData.education.map((edu, i) => (
                    <div key={i} className="dk-edu-card">
                        <div className="dk-edu-degree">{edu.degree} — {edu.field}</div>
                        <div className="dk-edu-institution">{edu.institution}</div>
                        <div className="dk-edu-year">Graduated {edu.year}</div>
                    </div>
                ))}
            </div>

            {/* Experience */}
            <div>
                <div className="dk-form-title">💻 Experience</div>
                {parsedData.experience.map((exp, i) => (
                    <div key={i} className="dk-exp-card">
                        <div className="dk-exp-title">{exp.title}</div>
                        <div className="dk-exp-meta">{exp.company} · {exp.duration}</div>
                        <div className="dk-exp-desc">{exp.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ResumeInsights;
