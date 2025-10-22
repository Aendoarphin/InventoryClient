import useMetrics from "@/hooks/useMetrics";
import { IconInfoCircle } from "@tabler/icons-react";

function Metrics({ itemCount, vendorCount }: { itemCount: number; vendorCount: number }) {
  const metrics = useMetrics();
  const itemsMetrics = metrics[0];
  const vendorsMetrics = metrics[1];

  const itemCompletePct = itemsMetrics && itemCount > 0 ? (itemsMetrics.complete / itemCount) * 100 : 0;
  const itemPartialPct = itemsMetrics && itemCount > 0 ? (itemsMetrics.partial / itemCount) * 100 : 0;

  const vendorCompletePct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.complete / vendorCount) * 100 : 0;
  const vendorPartialPct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.partial / vendorCount) * 100 : 0;

  return (
    <div className="col-span-2 p-4 border border-muted shadow-md items-center">
      <div className="flex flex-row justify-between items-baseline">
        <h2>Metrics</h2>
        <IconInfoCircle
          className="inline"
          title={
            "The following numbers represent the number of partial and complete records.\nPartial - The table contains a record with empty values\nComplete - All fields of a record contain a value."
          }
        />
      </div>

      {/* Legend */}
      <div className="flex flex-row gap-4 mt-2 mb-4">
        <div className="flex items-center gap-2" title="Records with null values">
          <div className="w-4 h-4 bg-warning"></div>
          <span className="text-sm">Partial</span>
        </div>
        <div className="flex items-center gap-2" title="Records without null values">
          <div className="w-4 h-4 bg-success"></div>
          <span className="text-sm">Complete</span>
        </div>
      </div>

      <div className="flex flex-row *:w-full border-muted *:py-4 border-t gap-4">
        {/* Items Metrics */}
        <div>
          <h4 className="mb-2">Items</h4>
          {/* Progress bar with labels */}
          <div className="h-8 w-full flex overflow-hidden relative">
            <div className="bg-success h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${itemCompletePct}%` }}>
              {itemsMetrics?.complete !== undefined && itemsMetrics.complete > 0 && (
                <span className="text-xs font-semibold text-white px-1">{itemsMetrics.complete}</span>
              )}
            </div>
            <div className="bg-warning h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${itemPartialPct}%` }}>
              {itemsMetrics?.partial !== undefined && itemsMetrics.partial > 0 && (
                <span className="text-xs font-semibold text-white px-1">{itemsMetrics.partial}</span>
              )}
            </div>
          </div>
        </div>

        {/* Vendors Metrics */}
        <div>
          <h4 className="mb-2">Vendors</h4>
          {/* Progress bar with labels */}
          <div className="h-8 w-full flex overflow-hidden relative">
            <div className="bg-success h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${vendorCompletePct}%` }}>
              {vendorsMetrics?.complete !== undefined && vendorsMetrics.complete > 0 && (
                <span className="text-xs font-semibold text-white px-1">{vendorsMetrics.complete}</span>
              )}
            </div>
            <div className="bg-warning h-full transition-all duration-500 flex items-center justify-center" style={{ width: `${vendorPartialPct}%` }}>
              {vendorsMetrics?.partial !== undefined && vendorsMetrics.partial > 0 && (
                <span className="text-xs font-semibold text-white px-1">{vendorsMetrics.partial}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;