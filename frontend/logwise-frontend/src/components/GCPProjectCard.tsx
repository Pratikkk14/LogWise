import { Play, Calendar } from 'lucide-react';

const GCPProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-slate-300">
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
  );
};

export default GCPProjectCard;
