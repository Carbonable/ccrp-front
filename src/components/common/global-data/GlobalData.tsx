import { GlobalKPI } from "@/components/KPI";
import { GlobalData } from "@/graphql/__generated__/graphql";

interface GlobalKPIProps {
    loading: boolean;
    error: any;
    data: any;
    refetch: () => void;
}

export default function GlobalDataComponent({ loading, error, data, refetch}: GlobalKPIProps) {

    if (error) {
        console.error(error);
    }

    const refetchData = () => {
        refetch();
    }

    const globalData: GlobalData = data?.getGlobalData;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
            <GlobalKPI title="Target (current year)" kpi={globalData?.target} loading={loading} error={error} refetchData={refetchData} />
            <GlobalKPI title="Actual (current year)" kpi={globalData?.actual} loading={loading} error={error} refetchData={refetchData} />
            <GlobalKPI title="Debt (current year)" kpi={globalData?.debt} loading={loading} error={error} refetchData={refetchData} />
            <GlobalKPI title="Number of projects" kpi={globalData?.number_of_projects} loading={loading} error={error} refetchData={refetchData} />
        </div>
    );
}