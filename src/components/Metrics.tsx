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

      <div className="flex flex-row *:w-full border-muted *:py-4 border-t gap-4">
        {/* Items Metrics */}
        <div>
          {/* Progress bar */}
          <div className="h-3 w-full flex overflow-hidden">
            <div className="bg-success h-full transition-all duration-500" style={{ width: `${itemCompletePct}%` }}></div>
            <div className="bg-warning h-full transition-all duration-500" style={{ width: `${itemPartialPct}%` }}></div>
          </div>

          <h4>Items</h4>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-warning font-bold">Partial</p>
            <p>{itemsMetrics?.partial ?? "Loading data..."}</p>
            <p className="text-success font-bold">Complete</p>
            <p>{itemsMetrics?.complete ?? "Loading data..."}</p>
          </div>
        </div>

        {/* Vendors Metrics */}
        <div>
          {/* Progress bar */}
          <div className="h-3 w-full flex overflow-hidden">
            <div className="bg-success h-full transition-all duration-500" style={{ width: `${vendorCompletePct}%` }}></div>
            <div className="bg-warning h-full transition-all duration-500" style={{ width: `${vendorPartialPct}%` }}></div>
          </div>

          <h4>Vendors</h4>
          <div className="grid grid-cols-2 gap-2">
            <p className="text-warning font-bold">Partial</p>
            <p>{vendorsMetrics?.partial ?? "Loading data..."}</p>
            <p className="text-success font-bold">Complete</p>
            <p>{vendorsMetrics?.complete ?? "Loading data..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
