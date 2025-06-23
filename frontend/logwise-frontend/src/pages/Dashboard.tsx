import React, { useState } from 'react';
import { getLogs } from  '../../services/api'; 
import { Plus, LogOut, Play, Trash2, Calendar, Clock, CheckCircle, Loader, Server, User } from 'lucide-react';
import TopNavBar from '.././components/topNavBar';
import GCPProjectCard from '.././components/GCPProjectCard';
import SessionList from '.././components/Sessionlist';
import FloatingActionButton from '.././components/FloatingActionButton';

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

  // const getStatusIcon = (status) => {
  //   switch (status) {
  //     case 'completed':
  //       return <CheckCircle className="w-4 h-4 text-green-500" />;
  //     case 'in-progress':
  //       return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
  //     default:
  //       return <Clock className="w-4 h-4 text-gray-400" />;
  //   }
  // };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case 'completed':
  //       return 'text-green-600 bg-green-50 border-green-200';
  //     case 'in-progress':
  //       return 'text-blue-600 bg-blue-50 border-blue-200';
  //     default:
  //       return 'text-gray-600 bg-gray-50 border-gray-200';
  //   }
  // };

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
              {projects.map((project) => (
                <GCPProjectCard key={project.id} project={project} />
              ))}
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