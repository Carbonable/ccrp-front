import { ProjectTypeRepartition } from '@/graphql/__generated__/graphql';
import { SmallTitle } from '../common/Title';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';
import { CustomLegend } from '../common/CustomGraphLegend';
import { getNumericPercentage } from '@/utils/utils';

export default function ProjectsTypes({ types }: { types: ProjectTypeRepartition }) {
  const transformedTypes = transformTypesObject(types);

  const CustomizedLabel = ({ x, y, value }: any) => {
    return (
      <text x={x + 5} y={y - 16} fill="#878A94" className="text-xs">
        {`${value}%`}
      </text>
    );
  };

  const legendPayload = [
    {
      type: 'removal',
      name: 'Removal',
      color: '#29A46F',
    },
    {
      type: 'avoidance',
      name: 'Avoidance',
      color: '#145136',
    },
  ];

  return (
    <div>
      <SmallTitle title="Projects Types" />
      <div className="h-full w-full md:mt-4">
        <ResponsiveContainer width="100%" aspect={1}>
          <BarChart
            data={transformedTypes}
            margin={{
              top: 50,
              right: 0,
              left: 0,
              bottom: 10,
            }}
            barGap={56}
          >
            <Bar
              dataKey="removal"
              fill="#29A46F"
              barSize={36}
              radius={[10, 10, 0, 0]}
              label={<CustomizedLabel />}
            />
            <Bar
              dataKey="avoidance"
              fill="#145136"
              barSize={36}
              radius={[10, 10, 0, 0]}
              label={<CustomizedLabel />}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="font-inter mx-auto w-fit text-center text-sm text-neutral-300 md:mt-2 lg:mt-0 lg:text-lg">
          <CustomLegend payload={legendPayload} />
        </div>
      </div>
    </div>
  );
}

// Function to transform the types object into an array
function transformTypesObject(obj: ProjectTypeRepartition) {
  return [
    { avoidance: getNumericPercentage(obj.avoidance), removal: getNumericPercentage(obj.removal) },
  ];
}
