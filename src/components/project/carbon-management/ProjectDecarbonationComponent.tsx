import ErrorReload from '../../common/ErrorReload';
import {
  Bar,
  Brush,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEffect, useState } from 'react';
import { CustomLegend } from '../../common/CustomGraphLegend';
import { NetZeroPlanning } from '@/graphql/__generated__/graphql';
import Title from '@/components/common/Title';

export default function ProjectDecarbonationComponent({
  isFullScreen,
  loading,
  error,
  data,
  refetch,
}: {
  isFullScreen: boolean;
  loading: boolean;
  error: any;
  data: any;
  refetch: any;
}) {
  const [bar1Name] = useState('Ex Post');
  const [bar2Name] = useState('Ex Ante');

  const [legendPayload, setLegendPayload] = useState([
    {
      name: 'Ex Post',
      color: '#046B4D',
    },
    {
      name: 'Ex Ante',
      color: '#06A475',
    },
    {
      name: 'Retired',
      color: '#0E3725',
    },
  ]);

  if (error) {
    console.error(error);
  }

  const refetchData = () => {
    refetch();
  };

  useEffect(() => {
    setLegendPayload([
      {
        name: bar1Name,
        color: '#046B4D',
      },
      {
        name: bar2Name,
        color: '#06A475',
      },
      {
        name: 'Retired',
        color: '#0E3725',
      },
    ]);
  }, [bar1Name, bar2Name]);

  const netZeroPlanning: NetZeroPlanning[] = data?.netZeroPlanning;

  if (loading) {
    return <div className="mt-12 w-full">Loading charts ...</div>;
  }

  if (error) {
    return (
      <div className="mt-12 w-full">
        <ErrorReload refetchData={refetchData} />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="font-inter rounded-lg bg-neutral-700 px-8 pb-4 pt-4 text-left text-xs font-extralight text-neutral-100">
          <p>{`Year: ${label}`}</p>
          <p>{`Ex-ante: ${payload[1].value} t`}</p>
          <p>{`Ex-post: ${payload[0].value} t`}</p>
          <p>{`Retired: ${parseInt(payload[2].value)}t`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={`mt-8 h-full w-full px-0`}>
      <Title title="Net Zero planning" />
      <ResponsiveContainer width="100%" height="100%" aspect={2.2}>
        <ComposedChart
          width={300}
          height={300}
          data={netZeroPlanning}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          style={{
            fontSize: '14px',
            fontFamily: 'Inter',
          }}
        >
          <CartesianGrid stroke="#2B2E36" />
          <XAxis dataKey="vintage" />
          <YAxis yAxisId="left" domain={[0, 'dataMax']} label={{ value: 'Tons', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          {!isFullScreen && <Legend />}
          <Bar dataKey="ex_post_count" name={bar1Name} yAxisId="left" stackId="a" fill="#046B4D">
            {netZeroPlanning.map((entry: any, index: number) => {
              return (
                // @ts-ignore
                <Cell key={`cell-${index}`} radius={entry.ex_ante_count === 0 ? 10 : undefined} />
              );
            })}
          </Bar>
          <Bar
            dataKey="ex_ante_count"
            name={bar2Name}
            yAxisId="left"
            stackId="a"
            fill="#06A475"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="retired"
            name="Retired"
            yAxisId="left"
            fill="#0E3725"
            radius={[10, 10, 0, 0]}
          />
          <Brush dataKey="vintage" height={30} stroke="#878A94" fill="#1F2128" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="font-inter mx-auto w-fit text-center text-sm text-neutral-300 md:mt-2 lg:text-lg">
        <CustomLegend payload={legendPayload} />
      </div>
    </div>
  );
}
