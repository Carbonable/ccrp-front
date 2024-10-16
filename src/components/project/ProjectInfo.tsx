import { ProjectGlobalData } from '@/graphql/__generated__/graphql';
import { KPI } from '../KPI';

export default function ProjectInfo({
  name,
  data,
}: {
  name: string | any;
  data: ProjectGlobalData | any;
}) {
  if (data === undefined) {
    return (
      <div className="relative w-full rounded-lg bg-project-header-border p-[1px]">
        <div className="relative w-full overflow-hidden rounded-lg bg-project-header p-6">
          <div className="text-xl font-bold uppercase">{name}</div>
          <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3">
            <KPI title="$ Amount" kpi={`TBD`} />
            <KPI title="Source" kpi={`TBD`} />
            <KPI title="Rating" kpi={`TBD`} />
            <KPI title="Allocated units" kpi={`TBD`} />
            <KPI title="Available ex-post" kpi={`TBD`} />
            <KPI title="Available ex-ante" kpi={`TBD`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg bg-project-header-border p-[1px]">
      <div className="relative w-full overflow-hidden rounded-lg bg-project-header p-6">
        <div className="text-xl font-bold uppercase">{name}</div>
        <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-3">
          <KPI title="$ Amount" kpi={data.amount} />
          <KPI title="Source" kpi={data.source} />
          <KPI title="Rating" kpi={data.rating} />
          <KPI title="Allocated units" kpi={data.allocated_units} />
          <KPI title="Available ex-post" kpi={data.available_ex_post} />
          <KPI title="Available ex-ante" kpi={data.available_ex_ante} />
        </div>
      </div>
    </div>
  );
}
