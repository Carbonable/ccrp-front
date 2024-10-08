import Repartition from './block/Repartition';
import CircleProgress from './block/CircleProgress';
import AllocationKPI from './block/AllocationKPI';
import { BusinessUnit } from '@/graphql/__generated__/graphql';

export default function Block({ block }: { block: BusinessUnit }) {
  return (
    <div className="w-full cursor-pointer rounded-3xl border border-neutral-700 p-4 hover:brightness-[120%] xl:p-8">
      <div className="flex items-center justify-start">
        <div className="text-xl text-neutral-50">{block.name}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-4 lg:gap-x-8">
        <AllocationKPI title="Yearly Emission" value={block.yearly_emissions?.toString()} />
        <AllocationKPI title="yearly contribution" value={block.yearly_contributions?.toString()} />
        <div className="w-full">
          <CircleProgress
            rate={block.actual_rate}
            size={52}
            bgColor="#29A46F"
            progressColor="#363840"
          />
        </div>
      </div>
      <div className="mt-8 flex h-4 w-full items-center justify-start rounded-full bg-neutral-600 p-[4px]">
        <Repartition block={block} />
      </div>
    </div>
  );
}
