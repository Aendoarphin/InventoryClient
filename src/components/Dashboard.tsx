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
    try {
      setIsRefreshing(true);
      await pingDevices();
    } finally {
      setIsRefreshing(false);
    }
  };

  const itemsMetrics = metrics[0];
  const vendorsMetrics = metrics[1];

  const itemCompletePct = itemsMetrics && itemCount > 0 ? (itemsMetrics.complete / itemCount) * 100 : 0;
  const itemPartialPct = itemsMetrics && itemCount > 0 ? (itemsMetrics.partial / itemCount) * 100 : 0;

  const vendorCompletePct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.complete / vendorCount) * 100 : 0;
  const vendorPartialPct = vendorsMetrics && vendorCount > 0 ? (vendorsMetrics.partial / vendorCount) * 100 : 0;

  const activeEmployees = employees.filter((e) => !e.endDate);
  const inactiveEmployees = employees.filter((e) => e.endDate);

  if (loading || itemCount == null || vendorCount == null) return <Loader />;

  return (
    <div className="mt-6 mx-auto h-max gap-4 flex flex-wrap">
      <div className="bg-card border-muted border shadow-md p-4">
        {/* Server Status */}
        <div className="flex flex-row justify-between items-center">
          <h4 className="font-semibold">Server Status</h4>
          <button onClick={handleRefresh} className="p-1 transition-colors" disabled={isRefreshing}>
            <IconRefresh size={18} title="Refresh" className={isRefreshing ? "contrast-25 animate-spin" : ""} />
          </button>
        </div>
        <br />
        <div className={`grid grid-cols-4 gap-2 ${isRefreshing ? "opacity-50" : ""}`}>
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
          {devices?.length === 0 && <p className="text-muted text-center col-span-4">No Devices</p>}
        </div>
      </div>
      <div className="bg-card border-muted border shadow-md p-4">
        <div className="flex flex-row justify-between items-center">
          <h4 className="font-semibold">Table Info</h4>
          <button onClick={handleRefresh} className="p-1 transition-colors" disabled={isRefreshing}>
            <IconInfoCircle size={18} title="Partial records have at least one empty field." />
          </button>
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Items */}
          <div className="bg-muted/20 border border-muted/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium uppercase">Items</p>
              <span className="text-xs text-muted-foreground">{itemCount} total</span>
            </div>
            <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-success" style={{ width: `${itemCompletePct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Complete {itemsMetrics?.complete ?? 0} ({itemCompletePct.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Partial {itemsMetrics?.partial ?? 0} ({itemPartialPct.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Vendors */}
          <div className="bg-muted/20 border border-muted/30 p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium uppercase">Vendors</p>
              <span className="text-xs text-muted-foreground">{vendorCount} total</span>
            </div>
            <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-success" style={{ width: `${vendorCompletePct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Complete {vendorsMetrics?.complete ?? 0} ({vendorCompletePct.toFixed(1)}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Partial {vendorsMetrics?.partial ?? 0} ({vendorPartialPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card border-muted border shadow-md p-4">
        <div className="flex flex-row justify-between items-center">
          <h4 className="font-semibold">Employees</h4>
          <button onClick={handleRefresh} className="p-1 transition-colors" disabled={isRefreshing}>
            <IconInfoCircle size={18} />
          </button>
        </div>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employees */}
          <div className="bg-muted/20 border border-muted/30 p-3 md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{employees.length} total</span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success inline-block" />
                Active {activeEmployees.length}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Inactive {inactiveEmployees.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
