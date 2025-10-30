"use client";

import { useState, useEffect } from 'react';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch('/api/health/database');
      const data = await response.json();
      setStatus(data.connected ? 'connected' : 'disconnected');
      setLastCheck(new Date());
    } catch (error) {
      setStatus('disconnected');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const statusColors = {
    checking: 'bg-yellow-500',
    connected: 'bg-green-500',
    disconnected: 'bg-red-500'
  };

  const statusText = {
    checking: 'Checking...',
    connected: 'Connected',
    disconnected: 'Disconnected'
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-3 text-sm">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
          <span className="font-medium">Database: {statusText[status]}</span>
          <button 
            onClick={checkStatus}
            className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
        {lastCheck && (
          <div className="text-xs text-gray-500 mt-1">
            Last check: {lastCheck.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}