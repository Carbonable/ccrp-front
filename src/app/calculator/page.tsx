'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@apollo/client';
import { NET_ZERO_PLANNING } from '@/graphql/queries/net-zero';
import { CARBONABLE_COMPANY_ID } from '@/utils/constant';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface NetZeroPlanningRow {
  vintage: number;
  emission: number;
  target: number;
  actual: number;
  retired: number;
  ex_ante_count: number;
  ex_post_count: number;
}

function OrgDataPanel() {
  const { data, loading, error } = useQuery(NET_ZERO_PLANNING, {
    variables: { view: { company_id: CARBONABLE_COMPANY_ID } },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full" />
        <span className="ml-3 text-neutral-400">Loading organization data…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">
        Error loading data: {error.message}
      </div>
    );
  }

  const rows: NetZeroPlanningRow[] = (data?.netZeroPlanning ?? [])
    .filter((r: NetZeroPlanningRow) => r.vintage >= 2024 && r.vintage <= 2050)
    .sort((a: NetZeroPlanningRow, b: NetZeroPlanningRow) => a.vintage - b.vintage);

  if (rows.length === 0) {
    return (
      <div className="text-neutral-400 text-center py-12">
        No net-zero planning data available for 2024–2050.
      </div>
    );
  }

  const chartData = rows.map((r) => ({
    year: r.vintage,
    Emissions: Math.round(r.emission),
    Target: Math.round(r.target),
    Retired: Math.round(r.retired),
  }));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="bg-neutral-800/50 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-4">
          Emissions vs Target vs Retired (tCO₂)
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#a3a3a3', fontSize: 11 }}
              interval={Math.max(0, Math.floor(chartData.length / 10) - 1)}
            />
            <YAxis tick={{ fill: '#a3a3a3', fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#262626',
                border: '1px solid #404040',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend wrapperStyle={{ color: '#a3a3a3' }} />
            <Bar dataKey="Emissions" fill="#ef4444" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Target" fill="#22c55e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="Retired" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-neutral-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-neutral-800">
              <tr className="text-neutral-400 text-left">
                <th className="px-4 py-3 font-medium">Year</th>
                <th className="px-4 py-3 font-medium text-right">Emissions (tCO₂)</th>
                <th className="px-4 py-3 font-medium text-right">Target (tCO₂)</th>
                <th className="px-4 py-3 font-medium text-right">Actual Retired</th>
                <th className="px-4 py-3 font-medium text-right">Delta</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const delta = r.target - r.retired;
                return (
                  <tr
                    key={r.vintage}
                    className="border-t border-neutral-700/50 hover:bg-neutral-700/30 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-white font-medium">{r.vintage}</td>
                    <td className="px-4 py-2.5 text-right text-red-400">
                      {Math.round(r.emission).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-green-400">
                      {Math.round(r.target).toLocaleString()}
                    </td>
                    <td className="px-4 py-2.5 text-right text-blue-400">
                      {Math.round(r.retired).toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-medium ${
                        delta > 0 ? 'text-amber-400' : 'text-green-400'
                      }`}
                    >
                      {delta > 0 ? '+' : ''}
                      {Math.round(delta).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend note */}
      <p className="text-neutral-500 text-xs px-1">
        Delta = Target − Actual Retired. Positive values indicate a gap to fill with credits.
      </p>
    </div>
  );
}

export default function CalculatorPage() {
  const [showOrgData, setShowOrgData] = useState(false);
  const iframeUrl = 'https://kalculator.carbonable.io';

  return (
    <div className="w-full">
      {/* Banner */}
      <div className="mx-4 mt-4 mb-2 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <InformationCircleIcon className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-amber-200">
            {showOrgData
              ? 'Showing real organization data from your Net Zero Planning.'
              : 'Data shown is from demo calculations. Connect to your organization data for accurate projections.'}
          </p>
        </div>
        <button
          onClick={() => setShowOrgData(!showOrgData)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer bg-green-500 hover:bg-green-400 text-neutral-900"
        >
          {showOrgData ? '🔢 View Calculator' : '📊 View org data'}
        </button>
      </div>

      {showOrgData ? (
        <div className="px-4 pb-4">
          <OrgDataPanel />
        </div>
      ) : (
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
      )}
    </div>
  );
}
