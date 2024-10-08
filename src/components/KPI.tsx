interface KPIProps {
  title: string;
  kpi: any;
  loading?: boolean;
  error?: any;
  refetchData?: () => void;
}

export function GlobalKPI({ title, kpi, loading, error, refetchData }: KPIProps) {
  const cssClass =
    'relative w-full border border-neutral-700 bg-allocation-card bg-blend-overlay bg-cover py-2 px-4 md:py-4 md:px-8 rounded-xl';
  if (loading)
    return (
      <div className={cssClass}>
        <div className="text-sm font-light text-neutral-300">{title}</div>
        <div className="mt-2 h-6 w-3/4 animate-pulse rounded-md bg-opacityLight-10"></div>
      </div>
    );

  if (error)
    return (
      <div className={cssClass}>
        <div className="text-sm font-light text-neutral-300">{title}</div>
        <div
          className="mt-2 cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl font-bold text-neutral-100 hover:brightness-105"
          onClick={refetchData}
        >
          Reload
        </div>
      </div>
    );

  return (
    <div className={cssClass}>
      <div className="text-sm font-light text-neutral-300">{title}</div>
      <div className="mt-2 text-xl font-bold text-neutral-100">{kpi}</div>
    </div>
  );
}

export function KPI({
  title,
  kpi,
  loading,
  error,
  refetchData,
}: {
  title: string;
  kpi: any;
  loading?: boolean;
  error?: any;
  refetchData?: any;
}) {
  const cssClass =
    'relative w-full border border-opacityLight-10 py-1 px-2 md:py-2 md:px-4 rounded-lg';
  if (loading)
    return (
      <div className={cssClass}>
        <div className="text-sm font-light text-neutral-200">{title}</div>
        <div className="mt-2 h-6 w-3/4 animate-pulse rounded-md bg-opacityLight-10"></div>
      </div>
    );

  if (error)
    return (
      <div className={cssClass}>
        <div className="text-sm font-light text-neutral-200">{title}</div>
        <div
          className="mt-2 cursor-pointer rounded-xl border border-neutral-600 bg-opacityLight-5 px-4 py-2 text-xl text-neutral-100 hover:brightness-105"
          onClick={refetchData}
        >
          Reload
        </div>
      </div>
    );

  return (
    <div className={cssClass}>
      <div className="text-sm font-light text-neutral-200">{title}</div>
      <div className="mt-2 text-xl capitalize text-neutral-100">{kpi.toString().toLowerCase()}</div>
    </div>
  );
}
