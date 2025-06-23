import SessionCard from './SessionCard';

const SessionList = ({ sessions }) => (
  <div className="sticky top-8">
    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Sessions</h2>
    <div className="space-y-3">
      {sessions.map((session) => (
        <SessionCard key={session.id} session={session} />
      ))}
    </div>

    <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-white py-3 rounded-lg text-sm font-medium transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400">
      View All Sessions
    </button>
  </div>
);

export default SessionList;
