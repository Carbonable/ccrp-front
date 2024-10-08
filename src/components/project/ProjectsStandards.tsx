import { Map } from '@/graphql/__generated__/graphql';
import { getNumericPercentage } from '@/utils/utils';
import { SmallTitle } from '../common/Title';
import SquaredInitials from '../common/SquaredInitials';

export default function ProjectsStandards({ standards }: { standards: Map[] }) {
  let standardsToSort = [...standards];
  standardsToSort.sort((a, b) => {
    const bValue = getNumericPercentage(b.value);
    const aValue = getNumericPercentage(a.value);
    return bValue - aValue;
  });

  return (
    <div>
      <SmallTitle title="Projects Standards" />
      <div className="h-full w-full md:mt-4 md:max-h-[420px] md:overflow-x-scroll">
        {standardsToSort.map((standard, index) => (
          <ProjectStandardDetails key={index} standard={standard} />
        ))}
      </div>
    </div>
  );
}

function ProjectStandardDetails({ standard }: { standard: Map }) {
  return (
    <div className="mt-8 flex w-full justify-start px-4">
      <div className="min-w-[32px]">
        <SquaredInitials text={standard.key} color="random" />
      </div>
      <div className="w-full pl-8">
        <div className="font-inter text-sm text-neutral-300">{standard.key}</div>
        <div className="mt-1 flex items-center">
          <div className="h-2 w-full rounded-full bg-opacityLight-5">
            <div
              className="h-2 rounded-full bg-greenish-700"
              style={{ width: `${getNumericPercentage(standard.value)}%` }}
            ></div>
          </div>
          <div className="font-inter ml-3 text-xs text-neutral-300">
            {getNumericPercentage(standard.value)}%
          </div>
        </div>
      </div>
    </div>
  );
}
