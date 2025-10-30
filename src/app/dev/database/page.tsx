"use client";

import { useState, useEffect } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

interface DatabaseInfo {
  connected: boolean;
  status: string;
  timestamp: string;
  error?: string;
}

interface TableInfo {
  table_name: string;
  row_count: number;
}

export default function DatabaseDevPage() {
  const [dbInfo, setDbInfo] = useState<DatabaseInfo | null>(null);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get database connection status
      const healthResponse = await fetch('/api/health/database');
      const healthData = await healthResponse.json();
      setDbInfo(healthData);

      // Get table information
      if (healthData.connected) {
        const tablesResponse = await fetch('/api/dev/tables');
        if (tablesResponse.ok) {
          const tablesData = await tablesResponse.json();
          setTables(tablesData.tables || []);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch database info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return (
      <ErrorState
        title="Development Only"
        message="This page is only available in development mode."
        icon="🚫"
      />
    );
  }

  if (loading) {
    return <LoadingState message="Loading database information..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error Loading Database Info"
        message={error}
        action={{
          label: "Retry",
          onClick: fetchDatabaseInfo
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="card border-l-4 border-brand">
        <h1 className="text-2xl font-bold mb-4 text-brand">Database Development Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor database status and explore your data structure.
        </p>
      </div>

      {/* Database Status */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${dbInfo?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="font-medium">
            {dbInfo?.connected ? 'Connected' : 'Disconnected'}
          </span>
          <span className="text-sm text-gray-500">
            Last checked: {dbInfo?.timestamp ? new Date(dbInfo.timestamp).toLocaleString() : 'Unknown'}
          </span>
        </div>
        
        {dbInfo?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-red-700 dark:text-red-300">
            <strong>Error:</strong> {dbInfo.error}
          </div>
        )}

        <button 
          onClick={fetchDatabaseInfo}
          className="btn btn-primary mt-4"
        >
          Refresh Status
        </button>
      </div>

      {/* Tables Information */}
      {dbInfo?.connected && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Tables Overview</h2>
          {tables.length === 0 ? (
            <p className="text-gray-500">No table information available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3">Table Name</th>
                    <th className="text-left py-2 px-3">Row Count</th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => (
                    <tr key={table.table_name} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 px-3 font-mono text-brand">{table.table_name}</td>
                      <td className="py-2 px-3">{table.row_count.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}