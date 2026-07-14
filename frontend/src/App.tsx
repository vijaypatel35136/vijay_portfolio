import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import ProfileSettings from './pages/Admin/ProfileSettings';
import SkillsManager from './pages/Admin/SkillsManager';
import ExperienceManager from './pages/Admin/ExperienceManager';
import ProjectsManager from './pages/Admin/ProjectsManager';
import EducationManager from './pages/Admin/EducationManager';
import MessagesInbox from './pages/Admin/MessagesInbox';
import SiteSettings from './pages/Admin/SiteSettings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Page */}
          <Route path="/" element={<Portfolio />} />
          
          {/* Admin Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Dashboard & CRUD CMS Views */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/profile" element={<ProfileSettings />} />
          <Route path="/admin/skills" element={<SkillsManager />} />
          <Route path="/admin/experience" element={<ExperienceManager />} />
          <Route path="/admin/projects" element={<ProjectsManager />} />
          <Route path="/admin/education" element={<EducationManager />} />
          <Route path="/admin/messages" element={<MessagesInbox />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
