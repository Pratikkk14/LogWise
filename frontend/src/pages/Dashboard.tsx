import React, { useState } from 'react';
import { Plus, LogOut, Play, Trash2, Calendar, Clock, CheckCircle, Loader, Server, User } from 'lucide-react';

const Dashboard = () => {
  const [projects] = useState([
    {
      id: 'proj-1',
      name: 'Production API',
      projectId: 'my-app-prod-123456',
      lastAnalyzed: '2 hours ago',
      status: 'active'
    },
    {
      id: 'proj-2',
      name: 'Staging Environment',
      projectId: 'my-app-staging-789012',
      lastAnalyzed: '1 day ago',
      status: 'active'
    },
    {
      id: 'proj-3',
      name: 'Development Logs',
      projectId: 'my-app-dev-345678',
      lastAnalyzed: '3 days ago',
      status: 'inactive'
    }
  ]);

  const [sessions] = useState([
    {
      id: 'sess-1',
      name: 'API Error Investigation',
      timeRange: '2024-06-19 14:00 - 16:30',
      status: 'completed',
      project: 'Production API'
    },
    {
      id: 'sess-2',
      name: 'Performance Analysis',
      timeRange: '2024-06-18 09:15 - 11:45',
      status: 'in-progress',
      project: 'Staging Environment'
    },
    {
      id: 'sess-3',
      name: 'Auth Flow Debug',
      timeRange: '2024-06-17 13:20 - 15:00',
      status: 'completed',
      project: 'Production API'
    },
    {
      id: 'sess-4',
      name: 'Database Query Optimization',
      timeRange: '2024-06-16 10:30 - 12:15',
      status: 'completed',
      project: 'Development Logs'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">Logwise</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <span className="text-sm font-medium text-slate-700">john@company.com</span>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Connected Projects */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Connected Projects</h2>
              <span className="text-sm text-slate-500">{projects.length} projects</span>
            </div>
            
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-slate-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3 font-mono">{project.projectId}</p>
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>Last analyzed {project.lastAnalyzed}</span>
                      </div>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Start Investigation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Sessions Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Sessions</h2>
              
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                        {session.name}
                      </h4>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(session.status)}
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-500 mb-2">{session.project}</p>
                    <p className="text-xs text-slate-600 font-mono mb-3">{session.timeRange}</p>
                    
                    <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getStatusColor(session.status)} mb-3`}>
                      {session.status.replace('-', ' ')}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-medium transition-colors">
                        Resume
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg text-sm font-medium transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400">
                View All Sessions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
        <Plus className="w-6 h-6" />
        <span className="sr-only">Connect New Project</span>
      </button>

      {/* Tooltip for FAB */}
      <div className="fixed bottom-20 right-6 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 pointer-events-none transition-opacity hover:opacity-100">
        Connect New Project
      </div>
    </div>
  );
};

export default Dashboard;