import type { ReactNode } from 'react';

interface BannerKPIProps {
  title: string;
  value: string;
  loading?: boolean;
  error?: any;
}

export default function BannerKPI({ title, value, loading, error }: BannerKPIProps) {
  if (loading) return <BannerKPIWrapper title={title}></BannerKPIWrapper>;

  if (error) return <BannerKPIWrapper title={title}>n/a</BannerKPIWrapper>;

  return <BannerKPIWrapper title={title}>{value}</BannerKPIWrapper>;
}

function BannerKPIWrapper({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="font-trash flex flex-col items-start justify-start text-neutral-100">
      <h1 className="text-xs font-bold uppercase md:text-sm lg:text-lg">{title}</h1>
      <div className="mt-3 text-2xl lg:text-4xl">{children}</div>
    </div>
  );
}
