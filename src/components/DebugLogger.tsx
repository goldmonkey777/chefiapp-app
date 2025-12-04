import React, { useEffect, useState } from 'react';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export const DebugLogger: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Interceptar console.log, console.error, etc.
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (message: string, type: LogEntry['type']) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev.slice(-20), { timestamp, message, type }]);
    };

    console.log = (...args: any[]) => {
      originalLog(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');

      // Determinar tipo baseado no conteúdo
      let type: LogEntry['type'] = 'info';
      if (message.includes('✅') || message.includes('success')) type = 'success';
      else if (message.includes('❌') || message.includes('error')) type = 'error';
      else if (message.includes('⚠️') || message.includes('warn')) type = 'warning';

      addLog(message, type);
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'error');
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      const message = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      addLog(message, 'warning');
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
      >
        Show Logs
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-90 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-white font-bold text-lg">🔍 Debug Logger</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLogs([])}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-400 text-center mt-8">
            Aguardando logs...
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                log.type === 'success' ? 'bg-green-900/30 text-green-300' :
                log.type === 'error' ? 'bg-red-900/30 text-red-300' :
                log.type === 'warning' ? 'bg-yellow-900/30 text-yellow-300' :
                'bg-gray-800/50 text-gray-300'
              }`}
            >
              <span className="text-gray-500 mr-2">[{log.timestamp}]</span>
              <span className="whitespace-pre-wrap break-words">{log.message}</span>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="bg-gray-800 p-2 text-center text-white text-xs border-t border-gray-700">
        Total logs: {logs.length} | Success: {logs.filter(l => l.type === 'success').length} |
        Errors: {logs.filter(l => l.type === 'error').length}
      </div>
    </div>
  );
};
