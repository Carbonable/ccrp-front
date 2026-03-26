'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';

export default function CalculatorPage() {
  const iframeUrl = 'https://kalculator.carbonable.io';

  return (
    <div className="w-full">
      {/* Demo data banner */}
      <div className="mx-4 mt-4 mb-2 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <InformationCircleIcon className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
        <p className="text-sm text-amber-200">
          Data shown is from demo calculations. Connect to your organization data for accurate projections.
        </p>
      </div>

      <iframe
        key={iframeUrl}
        src={iframeUrl}
        title="Kalculator"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: 'calc(100vh - 60px)',
          border: 'none',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}
