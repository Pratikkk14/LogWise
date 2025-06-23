import SessionCard from './SessionCard';

type Session = {
  id: string;
  name: string;
  timeRange: string;
  status: string;
  project: string;
};

type Props = {
  sessions: Session[];
  onResume: (sessionId: string) => void;
};

const SessionList = ({ sessions, onResume }: Props) => (
  <div className="sticky top-8">
    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Sessions</h2>
    <div className="space-y-3">
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No sessions yet. Start your first investigation!
        </div>
      ) : (
        sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onResume={() => onResume(session.id)}
          />
        ))
      )}
    </div>

    <button className="w-full mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg text-sm font-medium transition-colors border-2 border-dashed border-slate-300 hover:border-slate-400">
      View All Sessions
    </button>
  </div>
);

export default SessionList;