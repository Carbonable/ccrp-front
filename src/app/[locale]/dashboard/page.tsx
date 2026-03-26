import ProjectDecarbonation from '@/components/common/global-data/ProjectDecarbonation';
import OrdersAnnualTable from '@/components/dashboard/net-zero/OrdersAnnualTable';
import ProjectDecarbonationTableCumulative from '@/components/dashboard/net-zero/ProjectDecarbonationTableCumulative';
import GlobalData from '@/components/dashboard/net-zero/GlobalData';
import ProjectDecarbonationTable from '@/components/dashboard/net-zero/ProjectDecarbonationTable';
import FinancialAnalysisTable from '@/components/dashboard/net-zero/FinancialAnalysisTable';

export default function Dashboard() {
  return (
    <div>
      <GlobalData />
      <div className="mt-8">
        <ProjectDecarbonation isFullScreen={true} />
        <ProjectDecarbonationTable />
        <ProjectDecarbonationTableCumulative />
        <OrdersAnnualTable />
        <FinancialAnalysisTable />
      </div>
    </div>
  );
}
