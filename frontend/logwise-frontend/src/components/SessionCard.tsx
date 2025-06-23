import { Trash2, Clock, CheckCircle, Loader } from 'lucide-react';

type Session = {
  id: string;
  name: string;
  timeRange: string;
  status: string;
  project: string;
};

type Props = {
  session: Session;
  onResume: () => void;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'in-progress':
      return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
    default:
      return <Clock className="w-4 h-4 text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const SessionCard = ({ session, onResume }: Props) => (
  <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
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
      <button
        onClick={onResume}
        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
      >
        Resume
      </button>
      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

export default SessionCard;