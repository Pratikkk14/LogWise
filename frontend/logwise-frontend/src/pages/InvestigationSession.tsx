import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { logsAPI, explainAPI, dashboardAPI } from '../../services/api'
import type { LogEntry } from '../../services/api';
import type { RangeKey } from '../components/useChartData'
import { useChartData } from '../components/useChartData'
import {
  Save,
  Search,
  Clock,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  PanelRightOpen,
  PanelRightClose,
  Calendar,
  BarChart3,
  List,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  ArrowLeft,
} from 'lucide-react';

/**
 * Build a one‐line “title” from the GCP protoPayload if present.
 * Falls back to the very first non-empty line of the message.
 */
function extractShortMessage(log: LogEntry): string {
  const msg = log.message as any;
  if (msg?.protoPayload) {
    const p = msg.protoPayload;
    const service = p.serviceName || 'unknownService';
    const method = p.methodName || 'unknownMethod';
    const resource = p.resourceName ?? p.resource?.name ?? 'unknownResource';
    const principal = p.authenticationInfo?.principalEmail || 'unknownUser';
    return `${service}.${method} on ${resource} by ${principal}`;
  }
  let raw =
    typeof log.message === 'string'
      ? log.message
      : JSON.stringify(log.message, null, 0);
  const firstLine = raw.split('\n').find((l) => l.trim().length > 0) ?? '';
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine;
}

/** Return the entire log payload as indented JSON or raw string. */
function formatFullMessage(log: LogEntry): string {
  if (typeof log.message === 'string') {
    return log.message;
  }
  try {
    return JSON.stringify(log.message, null, 2);
  } catch {
    return String(log.message);
  }
}

interface ProcessedLog {
  id: string;
  timestamp: string;
  severity: string;
  shortMessage: string;
  fullMessage: string;
  resourceType: string;
  labels: Record<string, string>;
}

const severityOptions = [
  { value: 'CRITICAL', label: 'Critical', color: 'bg-red-600', icon: AlertCircle },
  { value: 'ERROR', label: 'Error', color: 'bg-red-500', icon: AlertCircle },
  { value: 'WARNING', label: 'Warning', color: 'bg-yellow-500', icon: AlertTriangle },
  { value: 'EMERGENCY', label: 'Emergency', color: 'bg-red-800', icon: AlertCircle },
  { value: 'DEBUG', label: 'Debug', color: 'bg-gray-500', icon: Info },
  { value: 'INFO', label: 'Info', color: 'bg-blue-500', icon: Info },
  { value: 'ALERT', label: 'Alert', color: 'bg-red-700', icon: AlertCircle },
  { value: 'NOTICE', label: 'Notice', color: 'bg-blue-400', icon: Info }
];

const timeRangeToMinutes: Record<string, number> = {
  'last-1h': 60,
  'last-6h': 360,
  'last-24h': 1440,
  'last-7d': 10080,
};

const rangeBuckets: Record<string, number> = {
  'last-1h':  1,
  'last-6h':  6,
  'last-24h': 24,
  'last-7d':   7,
}

const InvestigationSession = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  // session info
  const [sessionData, setSessionData] = useState<any>(null);

  // filters & data
  const [selectedTimeRange, setSelectedTimeRange] = useState<RangeKey>('last-24h')
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(['ERROR', 'WARNING']);
  const [logs, setLogs] = useState<ProcessedLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('timeline');
  const [expandedLogs, setExpandedLogs] = useState(new Set<string>());
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [selectedLogForExplain, setSelectedLogForExplain] = useState<ProcessedLog | null>(null);
  const [personalNotes, setPersonalNotes] = useState('');
  const [hoveredLog, setHoveredLog] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [explainLoading, setExplainLoading] = useState(false);



  // Load session metadata
  useEffect(() => {
    if (!sessionId) return;
     dashboardAPI.getSessions()
                 .then(all => {
     const ses = all.find((s) => s.id === sessionId)
     if (!ses) throw new Error('Invalid session')
     setSessionData(ses)
   })
    .then(setSessionData)
    .catch(() => setError('Invalid session'))
}, [sessionId])

  // Load logs when filters change
  useEffect(() => {
    if (!sessionId) return;
    const minutes = timeRangeToMinutes[selectedTimeRange] ?? 1440;
    setLoading(true);
    setError(null);

    const calls = selectedSeverities.length > 0 
    ? selectedSeverities.map((s) => 
      logsAPI.getLogs(minutes, 0, s) ) 
    : [logsAPI.getLogs(minutes, 0)]

    Promise.all(calls)
      .then((responses) => {
        const all: LogEntry[] = responses.flatMap((r) => r.logs);
        const processed: ProcessedLog[] = all.map((log, idx) => ({
          id: `log-${idx}-${log.timestamp}`,
          timestamp: log.timestamp,
          severity: log.severity,
          shortMessage: extractShortMessage(log),
          fullMessage: formatFullMessage(log),
          resourceType: log.resource_type,
          labels: log.labels,
        }));
        processed.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        setLogs(processed);
      })
      .catch((e) => {
        console.error(e);
        setError('Failed to fetch logs');
      })
      .finally(() => setLoading(false));
  }, [sessionId, selectedTimeRange, selectedSeverities]);

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const handleExplainLog = async (log: ProcessedLog) => {
    setSelectedLogForExplain(log);
    setRightPanelOpen(true);
    setExplainLoading(true);

    try {
      const resp = await explainAPI.explainLog(
        log.fullMessage,
        sessionData?.project || ''
      );
      setExplanation(resp.explanation);
    } catch {
      setExplanation('Failed to get explanation');
    } finally {
      setExplainLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    const option = severityOptions.find(opt => opt.value === severity);
    return option ? option.icon : Info;
  };

  const getSeverityColor = (severity: string) => {
    const option = severityOptions.find(opt => opt.value === severity);
    return option ? option.color : 'bg-gray-500';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const milliseconds = date.getMilliseconds();
    const fractionalSeconds = `${milliseconds.toString().padStart(3, '0')}`;
    return `${date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}.${fractionalSeconds}`;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery ||
      log.shortMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.fullMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Generate chart data from logs
  const generateChartData = () => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      errors: 0,
      warnings: 0,
      total: 0
    }));

    filteredLogs.forEach(log => {
      const logHour = new Date(log.timestamp).getHours();
      const hourData = hours[logHour];

      if (hourData) {
        hourData.total++;
        if (log.severity === 'ERROR' || log.severity === 'CRITICAL') {
          hourData.errors++;
        } else if (log.severity === 'WARNING') {
          hourData.warnings++;
        }
      }
    });

    return hours;
  };

  const chartData = useChartData(filteredLogs, selectedTimeRange)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading investigation session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-4"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-xl font-bold text-white">Investigation Session</h1>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value as RangeKey)}
                className="bg-slate-700 border border-slate-600 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value="last-5m">Last 5 minutes</option>
                <option value="last-15m">Last 15 minutes</option>
                <option value="last-30m">Last 30 minutes</option>
                <option value="last-1h">Last 1 hour</option>
                <option value="last-6h">Last 6 hours</option>
                <option value="last-24h">Last 24 hours</option>
                <option value="yesterday">Yesterday</option>
                <option value="last-7d">Last 7 days</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-400">
              {filteredLogs.length} logs found
            </span>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Search Logs</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search log messages..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Severity Filters */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Severity Levels</label>
              <div className="space-y-2">
                {severityOptions.map((severity) => {
                  const Icon = severity.icon;
                  return (
                    <label key={severity.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSeverities.includes(severity.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSeverities([...selectedSeverities, severity.value]);
                          } else {
                            setSelectedSeverities(selectedSeverities.filter(s => s !== severity.value));
                          }
                        }}
                        className="rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-800"
                      />
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${severity.color}`}></div>
                        <span className="text-sm text-slate-300">{severity.label}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">View Mode</label>
              <div className="flex bg-slate-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    viewMode === 'timeline'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded text-sm font-medium transition-colors ${
                    viewMode === 'grouped'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span>Grouped</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* End of Sidebar */}

        {/* Timeline Chart */}
        <div className={`flex-1 flex flex-col overflow-hidden ${rightPanelOpen ? 'mr-96' : ''}`}>
          <div className="bg-slate-800 border-b border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Log Volume Over Time (Last 24 Hours)</h3>
            <div className="h-32 bg-slate-900 rounded-lg p-4 flex items-end space-x-1">
              {chartData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center cursor-pointer group"
                  style={{ height: '100%' }}
                >
                  <div className="flex flex-col justify-end h-full w-full space-y-0.5">
                    <div
                      className="bg-red-500 rounded-t opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${Math.max((data.errors / 10) * 80, 2)}%` }}
                      title={`Errors: ${data.errors}`}
                    ></div>
                    <div
                      className="bg-yellow-500 opacity-80 group-hover:opacity-100 transition-opacity"
                      style={{ height: `${Math.max((data.warnings / 10) * 60, 2)}%` }}
                      title={`Warnings: ${data.warnings}`}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">{data.hour}h</span>
                </div>
              ))}
            </div>
          </div>
          {/* End of TimelineChart */}

          {/* Log List */}
          <div className="flex-1 overflow-y-auto bg-slate-900">
            <div className="font-mono text-sm">
              {filteredLogs.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-slate-400">No logs found for the selected criteria.</p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const SeverityIcon = getSeverityIcon(log.severity);
                  const isExpanded = expandedLogs.has(log.id);
                  const isHovered = hoveredLog === log.id;

                  return (
                    <div
                      key={log.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      onMouseEnter={() => setHoveredLog(log.id)}
                      onMouseLeave={() => setHoveredLog(null)}
                    >
                      <div className="flex items-start p-4 space-x-4">
                        {/* Timestamp */}
                        <div className="text-slate-400 text-xs w-24 flex-shrink-0 pt-1">
                          {formatTimestamp(log.timestamp)}
                        </div>

                        {/* Severity */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity)}`}></div>
                          <span className="text-xs text-slate-400 w-16">{log.severity}</span>
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleLogExpansion(log.id)}
                              className="flex items-center space-x-2 text-left hover:text-white transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              )}
                              <span className="text-slate-300 truncate">{log.shortMessage}</span>
                            </button>

                            {isHovered && (
                              <button
                                onClick={() => handleExplainLog(log)}
                                className="flex items-center space-x-1 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors"
                              >
                                <HelpCircle className="w-3 h-3" />
                                <span>Explain</span>
                              </button>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="mt-3 p-4 bg-slate-800 rounded-lg">
                              <pre className="text-slate-300 text-xs whitespace-pre-wrap overflow-x-auto">
                                {log.fullMessage}
                              </pre>
                              <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-400">
                                <div>Resource: {log.resourceType}</div>
                                {Object.keys(log.labels).length > 0 && (
                                  <div className="mt-1">
                                    Labels: {JSON.stringify(log.labels, null, 2)}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          {/* End of LogList */}
        </div>

        {/* Explanation Panel */}
        {rightPanelOpen && (
          <div className="fixed right-0 top-16 bottom-0 w-96 bg-slate-800 border-l border-slate-700 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
              <button
                onClick={() => setRightPanelOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {selectedLogForExplain && (
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-3">Log Explanation</h4>
                  <div className="bg-slate-900 rounded-lg p-4">
                    {explainLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-slate-400">Generating explanation...</span>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {explanation}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-3">Personal Notes</h4>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Add your investigation notes here..."
                  className="w-full h-32 bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        )}
        {/* End of ExplanationPanel */}
      </div>

      {/* Right Panel Toggle Button */}
      <button
        onClick={() => setRightPanelOpen(!rightPanelOpen)}
        className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-slate-700 hover:bg-slate-600 p-2 rounded-lg shadow-lg transition-colors z-10"
      >
        {rightPanelOpen ? (
          <PanelRightClose className="w-5 h-5 text-slate-300" />
        ) : (
          <PanelRightOpen className="w-5 h-5 text-slate-300" />
        )}
      </button>
      {/* End of right panel toggle button */}
    </div>
  );
};

export default InvestigationSession;