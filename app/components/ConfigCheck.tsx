'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface HealthCheck {
  status: 'ready' | 'incomplete' | 'error';
  checks: {
    supabaseUrl: string;
    supabaseKey: string;
    vercelBlob: string;
  };
  database: {
    tableExists: string;
    rlsConfigured: string;
    error: string;
  };
  message: string;
}

export function ConfigCheck() {
  const [health, setHealth] = useState<HealthCheck | null>(null);

  useEffect(() => {
    const checkConfig = async () => {
      try {
        const res = await fetch('/api/health');
        const data: HealthCheck = await res.json();
        setHealth(data);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    checkConfig();
  }, []);

  if (!health || health.status === 'ready') return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-md z-40">
      <div className="bg-white border-l-4 border-yellow-500 rounded-lg shadow-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              ⚠️ Configuración Incompleta
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {health.database.error || health.message}
            </p>
            <p className="text-xs text-gray-500">
              Lee SETUP.md para instrucciones completas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
