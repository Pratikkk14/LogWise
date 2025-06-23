import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../../services/api'; // Updated import
import TopNavBar from '../components/topNavBar';
import GCPProjectCard from '../components/GCPProjectCard';
import SessionList from '../components/SessioList'; // Fixed typo
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the new API service
        const [projectsData, sessionsData] = await Promise.all([
          dashboardAPI.getProjects(),
          dashboardAPI.getSessions()
        ]);
        
        setProjects(projectsData); // API service already returns data
        setSessions(sessionsData); // API service already returns data
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartInvestigation = async (projectId: string) => {
    try {
      const response = await dashboardAPI.startSession(projectId);
      const sessionId = response.sessionId;
      
      // Update sessions list with new session
      const updatedSessions = await dashboardAPI.getSessions();
      setSessions(updatedSessions);
      
      // Navigate to session page
      window.location.href = `/session/${sessionId}`;
    } catch (err) {
      console.error('Failed to start session:', err);
      setError('Failed to start investigation session. Please try again.');
    }
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
                  />
                ))
              )}
            </div>
          </div>

          {/* Sessions Sidebar */}
          <div className="lg:col-span-1">
            <SessionList sessions={sessions} />
          </div>
        </div>
      </div>

      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;