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
  const [vendorsCount, setVendorsCount] = useState(0);
  const [modified, setModified] = useState(false);
  const [searchValues, setSearchValues] = useState("")
  
  const tableName = "Vendor"

  const vendors = useVendors(modified, searchValues);

  return (
    <>
      <div className="mx-auto flex flex-row *:h-full justify-between items-center">
        <h2 className=" translate-y-2">Vendors</h2>
        <p className="text-muted">
          Showing {vendorsCount} vendors out of {vendors.length}
        </p>
      </div>
      <VendorContext.Provider value={{ modified, setModified }}>
        <InventoryTable table={vendors} tableName={tableName} count={setVendorsCount} search={{searchValues, setSearchValues}} />
      </VendorContext.Provider>
    </>
  );
}
