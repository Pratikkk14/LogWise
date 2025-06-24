import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../../services/api';
import TopNavBar from '../components/topNavBar';
import GCPProjectCard from '../components/GCPProjectCard';
import SessionList from '../components/SessionList';
import FloatingActionButton from '../components/FloatingActionButton';

type Project = {
  id: string;
  name: string;
  projectId: string;
  lastAnalyzed: string;
  status: string;
};

type Session = {
  id: string;
  name: string;
  timeRange: string;
  status: string;
  project: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startingSession, setStartingSession] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);


        const [projectsData, sessionsData] = await Promise.all([
          dashboardAPI.getProjects(),
          dashboardAPI.getSessions()
        ]);
        
        setProjects(projectsData);
        setSessions(sessionsData);
      } catch (e) {
        console.error('Error loading dashboard data:', e);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartInvestigation = async (projectId: string) => {
    try {
      setStartingSession(projectId);
      setError(null);
      
      const response = await dashboardAPI.startSession(projectId);
      const sessionId = response.sessionId;

      // Refresh sessions
      const updatedSessions = await dashboardAPI.getSessions();
      setSessions(updatedSessions);
      
      // Navigate to investigation session page
      navigate(`/investigation/${sessionId}`);
    } catch (e) {
      console.error('Failed to start session:', e);
      setError('Failed to start investigation session. Please try again.');
    } finally {
      setStartingSession(null);
    }
  };

  const handleResumeSession = (sessionId: string) => {
    navigate(`/investigation/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNavBar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <TopNavBar />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavBar />
 
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connected Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Connected Projects</h2>
              <span className="text-sm text-slate-500">{projects.length} projects</span>
            </div>
            
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No projects connected yet. Use the + button to add one.
                </div>
              ) : (
                projects.map((project) => (
                  <GCPProjectCard
                    key={project.id}
                    project={project}
                    onStart={() => handleStartInvestigation(project.projectId)}
                    isStarting={startingSession === project.projectId}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sessions Sidebar */}
          <div className="lg:col-span-1">
            <SessionList sessions={sessions} onResume={handleResumeSession} />
          </div>
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;