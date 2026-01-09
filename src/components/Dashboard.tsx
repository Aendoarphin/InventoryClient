import { useEffect, useState, useCallback } from "react";
import useCounts from "@/hooks/useCounts";
import useEmployees from "@/hooks/useEmployees";
import useMetrics from "@/hooks/useMetrics";
import { IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import Loader from "./Loader";
import useDevices from "@/hooks/useDevices";
import axios from "axios";
import { baseApiUrl } from "@/static";

const PING_INTERVAL = 5000;

function Dashboard() {
  const { itemCount, vendorCount, loading } = useCounts();
  const metrics = useMetrics();
  const employees = useEmployees();
  const { devices } = useDevices();

  const [onlineDevices, setOnlineDevices] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const pingDevices = useCallback(async () => {
    if (!devices || devices.length === 0) return;

    try {
      const pingPromises = devices.map(async (d) => {
        try {
          const res = await axios.get(`${baseApiUrl}/Api/Network/ping/${d.ipv4}`, {
            timeout: 10000,
          });
          return res.data ? d.ipv4 : null;
        } catch (error) {
          return null;
        }
      });

      const results = await Promise.all(pingPromises);
      const successfulPings = results.filter((ip): ip is string => ip !== null);
      setOnlineDevices(successfulPings);
    } catch (error) {
      console.error("Ping failed", error);
    }
  }, [devices]);

  // Timed interval
  useEffect(() => {
    pingDevices();

    const interval = setInterval(pingDevices, PING_INTERVAL);

    return () => clearInterval(interval);
  }, [pingDevices]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await pingDevices();
    setIsRefreshing(false);
  };

  const itemsMetrics = metrics[0];
  const vendorsMetrics = metrics[1];

  const itemCompletePct = itemsMetrics && itemCount > 0 ? (itemsMetrics.complete / itemCount) * 100 : 0;
  const itemPartialPct = itemsMetrics && itemCount > 0 ? (itemsMetrics.partial / itemCount) * 100 : 0;

  const vendorCompletePct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.complete / vendorCount) * 100 : 0;
  const vendorPartialPct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.partial / vendorCount) * 100 : 0;

  if (loading || !itemCount || !vendorCount) return <Loader />;

  return (
    <div className="p-4 items-center mx-auto max-w-sm md:max-w-3xl bg-card border-muted border shadow-md">
      <div className="flex flex-row justify-between items-baseline mb-4">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <IconInfoCircle className="inline text-muted" title={"View info about managed assets"} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 *:flex *:items-center *:gap-2">
        <div title="Records with null values">
          <div className="w-3 h-3 bg-warning"></div>
          <span className="text-xs uppercase font-medium">Partial</span>
        </div>
        <div title="Records without null values">
          <div className="w-3 h-3 bg-success"></div>
          <span className="text-xs uppercase font-medium">Complete</span>
        </div>
        <div title="Current Employees">
          <div className="w-3 h-3 bg-info"></div>
          <span className="text-xs uppercase font-medium">Active</span>
        </div>
        <div title="Terminated Employees">
          <div className="w-3 h-3 bg-muted"></div>
          <span className="text-xs uppercase font-medium">Inactive</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-muted pt-4">
        {/* Items Metrics */}
        <section>
          <div className="mb-2 flex flex-row items-baseline justify-between">
            <h4 className="font-semibold">Items</h4>
            <p className="text-sm">Total: {itemCount}</p>
          </div>
          <div className="h-6 w-full flex overflow-hidden *:h-full *:transition-all *:flex *:items-center *:justify-center">
            <div className="bg-success" style={{ width: `${itemCompletePct}%` }}>
              {itemsMetrics?.complete > 0 && <span className="text-[10px] text-white px-1">{itemsMetrics.complete}</span>}
            </div>
            <div className="bg-warning" style={{ width: `${itemPartialPct}%` }}>
              {itemsMetrics?.partial > 0 && <span className="text-[10px] text-white px-1">{itemsMetrics.partial}</span>}
            </div>
          </div>
        </section>

        {/* Vendors Metrics */}
        <section>
          <div className="mb-2 flex flex-row items-baseline justify-between">
            <h4 className="font-semibold">Vendors</h4>
            <p className="text-sm">Total: {vendorCount}</p>
          </div>
          <div className="h-6 w-full flex overflow-hidden *:h-full *:transition-all *:flex *:items-center *:justify-center">
            <div className="bg-success" style={{ width: `${vendorCompletePct}%` }}>
              {vendorsMetrics?.complete > 0 && <span className="text-[10px] text-white px-1">{vendorsMetrics.complete}</span>}
            </div>
            <div className="bg-warning" style={{ width: `${vendorPartialPct}%` }}>
              {vendorsMetrics?.partial > 0 && <span className="text-[10px] text-white px-1">{vendorsMetrics.partial}</span>}
            </div>
          </div>
        </section>
      </div>

      {/* Employees Metrics */}
      <div className="mt-6">
        <div className="mb-2 flex flex-row items-baseline justify-between">
          <h4 className="font-semibold">Employees</h4>
          <p className="text-sm">Total: {employees.length}</p>
        </div>
        <div className="h-6 w-full flex overflow-hidden *:h-full *:flex *:items-center *:justify-center *:text-white *:text-[10px]">
          <div className="bg-info" style={{ width: `${(employees.filter((e) => !e.endDate).length / employees.length) * 100}%` }}>
            {employees.filter((e) => !e.endDate).length}
          </div>
          <div className="bg-muted" style={{ width: `${(employees.filter((e) => e.endDate).length / employees.length) * 100}%` }}>
            {employees.filter((e) => e.endDate).length || ""}
          </div>
        </div>
      </div>

      {/* Server Status */}
      <div className="mt-8 border-t border-muted pt-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <h4 className="font-semibold">Server Status</h4>
          <button onClick={handleRefresh} className="p-1 transition-colors" disabled={isRefreshing}>
            <IconRefresh size={18} title="Refresh" className={isRefreshing ? "contrast-25" : ""} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {devices &&
            devices.map((d) => (
              <div key={d.id} className={`flex items-center text-nowrap justify-between p-2 bg-muted/20 border border-muted/30 ${!onlineDevices.includes(d.ipv4) && "opacity-50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${onlineDevices.includes(d.ipv4) ? "bg-success" : "bg-red-500"}`} title={onlineDevices.includes(d.ipv4) ? "Online" : "Offline"} />
                  <div>
                    <p className="text-sm font-medium leading-none uppercase">{d.name}</p>
                    <p className="text-[10px] text-muted-foreground">{d.ipv4}</p>
                  </div>
                </div>
              </div>
            ))}
            {!devices && <p className="text-muted text-center col-span-4">No Devices</p>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
