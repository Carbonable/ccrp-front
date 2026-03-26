'use client';

import { useRef, useEffect } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { NET_ZERO_PLANNING } from '@/graphql/queries/net-zero';
import { CARBONABLE_COMPANY_ID } from '@/utils/constant';

interface NetZeroPlanningRow {
  vintage: number;
  emission: number;
  target: number;
  actual: number;
  retired: number;
  ex_ante_count: number;
  ex_post_count: number;
}

export default function CalculatorPage() {
  const iframeUrl = 'https://kalculator.carbonable.io';
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data, loading, error } = useQuery(NET_ZERO_PLANNING, {
    variables: { view: { company_id: CARBONABLE_COMPANY_ID } },
  });

  const sendDataToIframe = () => {
    if (!iframeRef.current?.contentWindow || !data?.netZeroPlanning) return;
    const rows: NetZeroPlanningRow[] = [...(data.netZeroPlanning ?? [])]
      .sort((a: NetZeroPlanningRow, b: NetZeroPlanningRow) => a.vintage - b.vintage);

    iframeRef.current.contentWindow.postMessage(
      {
        type: 'net-zero-planning-data',
        payload: rows.map((r) => ({
          year: r.vintage,
          gap: Math.max(0, r.target - r.retired),
        })),
      },
      '*',
    );
  };

  // Send data whenever it loads
  useEffect(() => {
    if (data) {
      sendDataToIframe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="w-full">
      {/* Banner */}
      <div
        className={`mx-4 mt-4 mb-2 flex items-start gap-3 rounded-xl border px-4 py-3 ${
          loading
            ? 'border-amber-500/30 bg-amber-500/10'
            : error
              ? 'border-red-500/30 bg-red-500/10'
              : 'border-green-700/30 bg-green-900/20'
        }`}
      >
        {loading ? (
          <>
            <div className="mt-0.5 h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
            <p className="text-sm text-amber-200">Loading organization data…</p>
          </>
        ) : error ? (
          <>
            <InformationCircleIcon className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
            <p className="text-sm text-red-300">Error loading organization data: {error.message}</p>
          </>
        ) : (
          <>
            <InformationCircleIcon className="h-5 w-5 shrink-0 text-green-400 mt-0.5" />
            <p className="text-sm text-green-200">✓ Organization data sent to calculator</p>
          </>
        )}
      </div>

      <iframe
        ref={iframeRef}
        key={iframeUrl}
        src={iframeUrl}
        title="Kalculator"
        sandbox="allow-scripts allow-same-origin"
        onLoad={sendDataToIframe}
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
