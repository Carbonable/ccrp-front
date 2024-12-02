import { Allocation, BusinessUnit } from '@/graphql/__generated__/graphql';
import { ColorAmount } from '../../../../graphql/__generated__/graphql';
import { colorLegendPayload } from '@/components/project/ProjectsColors';

export default function Repartition({ block }: { block: BusinessUnit }) {
  if (!block.allocations || block.allocations.length === 0 || !block.colors_amount || block.colors_amount.length == 0) {
    
    return <div className="h-[10px] w-full rounded-full bg-opacityLight-5"></div>;
  }

  const totalAllocation = block.colors_amount.reduce(
    (sum, color: any) => sum + color.amount,
    0,
  );


  return (
    <>
      {block.colors_amount.map((colorAmount: any, idx: number) => (
        <AllocationPercentage
          colorAmount={colorAmount}
          idx={idx}
          totalAllocation={totalAllocation}
          length={block.colors_amount ? block.colors_amount.length: 0}
          key={`allocation_${idx}`}
        />
      ))}
    </>
  );
}

function AllocationPercentage({
  colorAmount,
  idx,
  totalAllocation,
  length,
}: {
  colorAmount: ColorAmount;
  idx: number;
  totalAllocation: number;
  length: number;
}) {

const percentage = Math.round(colorAmount.amount / totalAllocation * 100);
let color = colorLegendPayload.filter((legend) => legend.type.toUpperCase() === colorAmount.color)[0].color;

  return (
    <div
      className={`${idx === 0 ? 'rounded-l-full' : ''} ${idx === length - 1 ? 'rounded-r-full' : ''} h-[10px]`}
      style={{ width: `${percentage}%`, backgroundColor: `${color}` }}
    ></div>
  );
}
