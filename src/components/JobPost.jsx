import { useState, useEffect } from 'react';

function JobPost() {
    const [jobs, setJobs] = useState([]);
    const [title, setTitle] = useState('');
    const [skillsInput, setSkillsInput] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setJobs(JSON.parse(localStorage.getItem('jobs') || '[]'));
    }, []);

    const saveJobs = (updated) => {
        setJobs(updated);
        localStorage.setItem('jobs', JSON.stringify(updated));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!title.trim()) { setError('Job title is required'); return; }
        const requiredSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
        if (!requiredSkills.length) { setError('Enter at least one required skill'); return; }

        if (editingId) {
            const updated = jobs.map(j =>
                j.id === editingId ? { ...j, title: title.trim(), requiredSkills } : j
            );
            saveJobs(updated);
            setSuccess('Job updated successfully!');
            setEditingId(null);
        } else {
            const newJob = {
                id: `JOB-${Date.now()}`,
                title: title.trim(),
                requiredSkills,
                postedAt: new Date().toISOString(),
            };
            saveJobs([...jobs, newJob]);
            setSuccess('Job posted successfully!');
        }
        setTitle('');
        setSkillsInput('');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleEdit = (job) => {
        setEditingId(job.id);
        setTitle(job.title);
        setSkillsInput(job.requiredSkills.join(', '));
        setError('');
        setSuccess('');
    };

    const handleDelete = (id) => {
        saveJobs(jobs.filter(j => j.id !== id));
        setSuccess('Job deleted.');
        setTimeout(() => setSuccess(''), 2500);
    };

    const handleCancel = () => {
        setEditingId(null);
        setTitle('');
        setSkillsInput('');
        setError('');
    };

    return (
        <>
            {/* Form */}
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <span className="dash-section-title-icon">{editingId ? '✏️' : '+'}</span>
                        {editingId ? 'Edit Job Posting' : 'Post New Job'}
                    </div>
                </div>

                {error && <div className="dk-error">⚠️ {error}</div>}
                {success && <div className="dk-success">✅ {success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="dk-field-group">
                        <label className="dk-field-label">Job Title</label>
                        <input
                            className="dk-field-input"
                            placeholder="e.g. Full Stack Developer"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="dk-field-group">
                        <label className="dk-field-label">Required Skills (comma-separated)</label>
                        <input
                            className="dk-field-input"
                            placeholder="e.g. React, Node.js, MongoDB"
                            value={skillsInput}
                            onChange={e => setSkillsInput(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button type="submit" className="dk-btn-primary">
                            {editingId ? '✔ Save Changes' : '📝 Post Job'}
                        </button>
                        {editingId && (
                            <button type="button" className="dk-btn-ghost" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Posted jobs */}
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <span className="dash-section-title-icon">📋</span>
                        Active Job Postings
                    </div>
                    <span className="dash-section-count">{jobs.length}</span>
                </div>

                {jobs.length === 0 ? (
                    <div className="dash-empty">
                        <span className="dash-empty-icon">📭</span>
                        No jobs posted yet. Use the form above to add your first job.
                    </div>
                ) : (
                    jobs.map(job => (
                        <div key={job.id} className="dk-job-card">
                            <div className="dk-job-card-header">
                                <div>
                                    <div className="dk-job-title">{job.title}</div>
                                    <div className="dk-job-id">{job.id} · Posted {new Date(job.postedAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button className="dk-btn-warning" onClick={() => handleEdit(job)}>
                                        ✏️ Edit
                                    </button>
                                    <button className="dk-btn-danger" onClick={() => handleDelete(job.id)}>
                                        🗑 Delete
                                    </button>
                                </div>
                            </div>
                            <div className="dk-job-meta">
                                {job.requiredSkills.map((s, i) => (
                                    <span key={i} className="dk-skill-chip">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

export default JobPost;
