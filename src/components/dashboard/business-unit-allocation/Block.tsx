import Repartition from './block/Repartition';
import CircleProgress from './block/CircleProgress';
import AllocationKPI from './block/AllocationKPI';
import { BusinessUnit } from '@/graphql/__generated__/graphql';

export default function Block({ block }: { block: BusinessUnit }) {
  const now = new Date().getFullYear();
  let {compensation_in_t,delta_in_t, compensation_ratio} = block;
 
  return (
    <div className="w-full cursor-pointer rounded-3xl border border-neutral-700 p-4 hover:brightness-[120%] xl:p-8">
      <div className="flex items-center justify-start">
        <div className="text-xl text-neutral-50">{block.name}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-x-4 lg:gap-x-8">
        <AllocationKPI title="Contributions (current year)" value={compensation_in_t?.toString()} />
        <AllocationKPI title="Delta (current year)" value={delta_in_t?.toString()} />
        <div className="w-full">
          <CircleProgress
            rate={compensation_ratio * 100}
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
