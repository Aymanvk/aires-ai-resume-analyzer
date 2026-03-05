import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import CandidateDashboard from './components/CandidateDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import './App.css';

function App() {
  // Track current user from localStorage
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    // Seed demo jobs ONCE if no jobs exist
    const existingJobs = localStorage.getItem('jobs');
    if (!existingJobs || JSON.parse(existingJobs).length === 0) {
      const demoJobs = [
        {
          id: 'JOB-1001',
          title: 'Frontend Developer',
          requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
          postedAt: new Date().toISOString()
        },
        {
          id: 'JOB-1002',
          title: 'Full Stack Developer',
          requiredSkills: ['React', 'Node.js', 'MongoDB'],
          postedAt: new Date().toISOString()
        },
        {
          id: 'JOB-1003',
          title: 'Python Developer',
          requiredSkills: ['Python', 'SQL', 'Flask'],
          postedAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('jobs', JSON.stringify(demoJobs));
    }
  }, []);

  // Handle login
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Protected route component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    if (allowedRole && currentUser.role !== allowedRole) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate Dashboard - Role Protected */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRole="candidate">
              <CandidateDashboard user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Dashboard - Role Protected */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRole="recruiter">
              <RecruiterDashboard user={currentUser} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
