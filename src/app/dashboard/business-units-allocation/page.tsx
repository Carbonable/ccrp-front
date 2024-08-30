import Banner from "@/components/dashboard/business-unit-allocation/Banner";
import DecarbonizationMap from "@/components/dashboard/business-unit-allocation/DecarbonizationMap";


export default function BusinessUnitsAllocationPage() {
  return (
    <div>
      <div className="relative mt-8">
        <Banner />
      </div>
      <div className="relative mt-8">
        <DecarbonizationMap />
      </div>
    </div>
  )
}