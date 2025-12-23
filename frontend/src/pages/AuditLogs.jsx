import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import API from '../api/axios';
import Loader from '../components/Loader';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/audit');
      setLogs(response.data.logs);
    } catch (err) {
      setError('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-700';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-700';
      case 'DELETE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderFieldChanges = (beforeState, afterState) => {
    if (!beforeState || !afterState) {
      return <p className="text-gray-600 text-sm">No detailed changes available</p>;
    }

    const changes = [];
    const allKeys = new Set([
      ...Object.keys(beforeState),
      ...Object.keys(afterState),
    ]);

    allKeys.forEach((key) => {
      if (beforeState[key] !== afterState[key] && key !== '_id' && key !== '__v') {
        changes.push({
          field: key,
          before: beforeState[key],
          after: afterState[key],
        });
      }
    });

    if (changes.length === 0) {
      return <p className="text-gray-600 text-sm">No field changes</p>;
    }

    return (
      <div className="space-y-2">
        {changes.map((change, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-medium text-gray-900">{change.field}:</span>
            <div className="mt-1 p-2 bg-gray-50 rounded">
              <p className="text-red-600">
                Before: <span className="font-mono">{JSON.stringify(change.before)}</span>
              </p>
              <p className="text-green-600">
                After: <span className="font-mono">{JSON.stringify(change.after)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Monitor all system activities and changes</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {logs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 font-medium">No audit logs yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedLog(expandedLog === idx ? null : idx)
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {log.taskId?.title || 'Unknown Task'}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">By:</span> {log.performedBy?.name} ({log.performedBy?.email})
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 text-gray-400">
                    {expandedLog === idx ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </button>

                {expandedLog === idx && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Changes</h4>
                    {renderFieldChanges(log.beforeState, log.afterState)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
