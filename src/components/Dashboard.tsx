import useEmployees from "@/hooks/useEmployees";
import useMetrics from "@/hooks/useMetrics";
import { IconInfoCircle } from "@tabler/icons-react";

function Dashboard({ itemCount, vendorCount }: { itemCount: number; vendorCount: number }) {
  const metrics = useMetrics();
  const employees = useEmployees()
  const itemsMetrics = metrics[0];
  const vendorsMetrics = metrics[1];

  const itemCompletePct = itemsMetrics && itemCount > 0 ? (itemsMetrics.complete / itemCount) * 100 : 0;
  const itemPartialPct = itemsMetrics && itemCount > 0 ? (itemsMetrics.partial / itemCount) * 100 : 0;

  const vendorCompletePct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.complete / vendorCount) * 100 : 0;
  const vendorPartialPct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.partial / vendorCount) * 100 : 0;

  return (
    <div className="p-4 items-center mx-auto max-w-sm md:max-w-3xl bg-card border-muted border shadow-md">
      <div className="flex flex-row justify-between items-baseline">
        <h2>Dashboard</h2>
        <IconInfoCircle className="inline" title={"View analytics of managed entities"} />
      </div>

      {/* Legend */}
      <div className="flex flex-row gap-4 mb-4 *:flex *:items-center *:gap-2">
        <div title="Records with null values">
          <div className="w-4 h-4 bg-warning"></div>
          <span className="text-sm">Partial</span>
        </div>
        <div title="Records without null values">
          <div className="w-4 h-4 bg-success"></div>
          <span className="text-sm">Complete</span>
        </div>
        <div title="Current Employees">
          <div className="w-4 h-4 bg-info"></div>
          <span className="text-sm">Active</span>
        </div>
        <div title="Terminated Employees">
          <div className="w-4 h-4 bg-muted"></div>
          <span className="text-sm">Inactive</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row *:w-full border-muted *:py-4 border-t gap-4">
        {/* Items Metrics */}
        <div>
          <div className="mb-2 flex flex-row items-baseline justify-between">
            <h4>Items</h4>
            <p>Total: {itemCount}</p>
          </div>
          {/* Progress bar with labels */}
          <div className="h-8 w-full flex overflow-hidden relative">
            <div className="bg-success h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${itemCompletePct}%` }}>
              {itemsMetrics?.complete !== undefined && itemsMetrics.complete > 0 && <span className="text-xs font-semibold text-white px-1">{itemsMetrics.complete}</span>}
            </div>
            <div className="bg-warning h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${itemPartialPct}%` }}>
              {itemsMetrics?.partial !== undefined && itemsMetrics.partial > 0 && <span className="text-xs font-semibold text-white px-1">{itemsMetrics.partial}</span>}
            </div>
          </div>
        </div>

        {/* Vendors Metrics */}
        <div>
          <div className="mb-2 flex flex-row items-baseline justify-between">
            <h4>Vendors</h4>
            <p>Total: {vendorCount}</p>
          </div>
          {/* Progress bar with labels */}
          <div className="h-8 w-full flex overflow-hidden relative">
            <div className="bg-success h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${vendorCompletePct}%` }}>
              {vendorsMetrics?.complete !== undefined && vendorsMetrics.complete > 0 && <span className="text-xs font-semibold text-white px-1">{vendorsMetrics.complete}</span>}
            </div>
            <div className="bg-warning h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${vendorPartialPct}%` }}>
              {vendorsMetrics?.partial !== undefined && vendorsMetrics.partial > 0 && <span className="text-xs font-semibold text-white px-1">{vendorsMetrics.partial}</span>}
            </div>
          </div>
        </div>
      </div>
      {/* Employees Metrics */}
      <div>
        <div className="mb-2 flex flex-row items-baseline justify-between">
          <h4>Employees</h4>
          <p>Total: {employees.length}</p>
        </div>
        {/* Progress bar with labels */}
        <div className="h-8 w-full flex overflow-hidden relative *:h-full *:transition-all *:duration-500 *:flex *:items-center *:justify-center *:text-white *:px-6 *:font-semibold *:text-xs">
          <div className="bg-info" style={{ width: `${employees.filter((e) => !e.endDate).length / employees.length * 100}%` }}>
            {employees.filter((e) => !e.endDate).length}
          </div>
          <div className="bg-muted" style={{ width: `${employees.filter((e) => e.endDate).length / employees.length * 100}%` }}>
            {employees.filter((e) => e.endDate).length}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
