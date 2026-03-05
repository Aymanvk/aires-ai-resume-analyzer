import { useState } from 'react';

function ResumeUpload({ user, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (e) => {
        const selected = e.target.files[0];
        setError('');
        setSuccess('');
        if (!selected) return;

        const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const ext = selected.name.split('.').pop().toLowerCase();
        if (!allowed.includes(selected.type) && !['pdf', 'docx'].includes(ext)) {
            setError('Only PDF and DOCX files are allowed');
            return;
        }
        setFile(selected);
    };

    const handleUpload = () => {
        if (!file) { setError('Please select a file first'); return; }
        setUploading(true);
        setError('');

        setTimeout(() => {
            const mockParsedData = {
                skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
                education: [{ degree: 'Bachelor of Technology', field: 'Computer Science', institution: 'ABC University', year: '2023' }],
                experience: [{ title: 'Software Developer Intern', company: 'Tech Corp', duration: '6 months', description: 'Developed web applications using React and Node.js' }]
            };
            const resumeData = {
                userId: user.id,
                fileName: file.name,
                fileSize: file.size,
                uploadedAt: new Date().toISOString(),
                parsedData: mockParsedData,
            };
            localStorage.setItem(`resume_${user.id}`, JSON.stringify(resumeData));
            setSuccess('Resume uploaded and parsed successfully!');
            setUploading(false);
            setFile(null);
            if (onUploadComplete) onUploadComplete(resumeData);
        }, 1500);
    };

    return (
        <div className="dash-section">
            <div className="dash-section-header">
                <div className="dash-section-title">
                    <span className="dash-section-title-icon">📄</span>
                    Upload Resume
                </div>
            </div>

            {error && <div className="dk-error">⚠️ {error}</div>}
            {success && <div className="dk-success">✅ {success}</div>}

            <div
                className="dk-upload-area"
                onClick={() => document.getElementById('aires-resume-upload').click()}
            >
                <input
                    id="aires-resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                />
                <span className="dk-upload-icon">📁</span>
                <div className="dk-upload-text">
                    {file ? file.name : 'Click to select resume'}
                </div>
                <div className="dk-upload-sub">
                    {file
                        ? `${(file.size / 1024).toFixed(1)} KB · Ready to upload`
                        : 'Supported formats: PDF, DOCX'}
                </div>
            </div>

            {file && (
                <button
                    className="dk-btn-primary"
                    onClick={handleUpload}
                    disabled={uploading}
                    style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
                >
                    {uploading ? <><span className="dk-spinner" /> Parsing with AI...</> : '⬆ Upload & Analyse Resume'}
                </button>
            )}

            <div className="dk-ai-badge" style={{ marginTop: 16 }}>
                <span>🤖</span>
                Our AI will automatically extract your skills, education, and experience to match you with relevant jobs.
            </div>
        </div>
    );
}

export default ResumeUpload;
