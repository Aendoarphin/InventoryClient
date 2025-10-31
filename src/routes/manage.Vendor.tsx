import InventoryTable from "@/components/InventoryTable";
import useVendors from "@/hooks/useVendors";
import { createFileRoute } from "@tanstack/react-router";
import { createContext, useState } from "react";

export const Route = createFileRoute("/manage/Vendor")({
  component: RouteComponent,
});

export const VendorContext = createContext<{
  modified: boolean;
  setModified: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function RouteComponent() {
  const [vendorsCount, setVendorsCount] = useState({ start: 0, end: 0, total: 0 });
  const [modified, setModified] = useState(false);
  const [searchValues, setSearchValues] = useState("");

  const vendors = useVendors(modified, searchValues);

  return (
    <>
      <VendorContext.Provider value={{ modified, setModified }}>
        <div className="mx-auto flex flex-row *:h-full justify-between items-baseline">
          <h2>Vendors</h2>
          <p className="text-muted">
            Showing {vendorsCount.start}-{vendorsCount.end} out of {vendorsCount.total} vendors
          </p>
        </div>
        <InventoryTable table={vendors} tableName={"Vendor"} count={setVendorsCount} search={{ searchValues, setSearchValues }} />
      </VendorContext.Provider>
    </>
  );
}
