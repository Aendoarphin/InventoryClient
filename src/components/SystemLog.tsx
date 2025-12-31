import { type ReactElement } from "react";
import useAccessLevels from "@/hooks/useAccessLevels";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import useEmployees from "@/hooks/useEmployees";
import useItems from "@/hooks/useItems";
import useVendors from "@/hooks/useVendors";
import useResourceAssociations from "@/hooks/useResourceAssociations";

interface BaseData {
  id: string | number;
  name?: string;
  [key: string]: any;
}

interface LogSectionProps {
  title: string;
  data: BaseData[] | undefined | null;
}

const LogSection = ({ title, data }: LogSectionProps): ReactElement => {
  return (
    <details className="mb-2 overflow-hidden border border-slate-200">
      <summary className="flex items-center justify-between px-3 py-2 cursor-pointer bg-slate-50 font-semibold text-[13px] list-none">
        <span>{title}</span>
        <span className="bg-info text-white text-[10px] px-1.5 py-0.5 min-w-[20px] text-center">
          {data?.length || 0}
        </span>
      </summary>
      <div className="p-2.5 bg-white border-t border-slate-200 text-[11px] max-h-[300px] overflow-y-auto">
        {data ? (
          <pre className="m-0 whitespace-pre-wrap break-all font-mono">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <span className="text-slate-500 italic">No data available</span>
        )}
      </div>
    </details>
  );
};

// --- Main Component ---

const SystemLog = () => {
  const myData = [
    {
      title: "Access Levels",
      data: useAccessLevels().accessLevels,
    },
    {
      title: "EmployeeResourceAssociations",
      data: useResourceAssociations(),
    },
    {
      title: "Employees",
      data: useEmployees(),
    },
    {
      title: "Items",
      data: useItems(false, ""),
    },
    {
      title: "ResourceCategories",
      data: useResourceCategories().resourceCategories,
    },
    {
      title: "Resources",
      data: useResources().resources,
    },
    {
      title: "Vendors",
      data: useVendors(false, ""),
    },
  ];

  return (
    <div className="p-2.5 font-sans">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="m-0 text-sm font-bold text-slate-800">System Tables</h3>
      </div>
      {myData.map((e) => (
        <LogSection key={e.title} title={e.title} data={e.data} />
      ))}
    </div>
  );
};

export default SystemLog;
