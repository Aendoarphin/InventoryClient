import InventoryTable from "@/components/InventoryTable";
import useItems from "@/hooks/useItems";
import { createFileRoute } from "@tanstack/react-router";
import { createContext, useState } from "react";

export const Route = createFileRoute("/manage/Item")({
  component: RouteComponent,
});

export const ItemContext = createContext<{
  modified: boolean;
  setModified: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function RouteComponent() {
  const [itemsCount, setItemsCount] = useState({ start: 0, end: 0, total: 0 });
  const [modified, setModified] = useState(false);
  const [searchValues, setSearchValues] = useState("");

  const items = useItems(modified, searchValues);

  return (
    <>
      <ItemContext.Provider value={{ modified, setModified }}>
        <div className="mx-auto flex flex-row *:h-full justify-between items-baseline">
          <h2>Items</h2>
          <p className="text-muted">
            Showing {itemsCount.start}-{itemsCount.end} out of {itemsCount.total} items
          </p>
        </div>
        <InventoryTable table={items} tableName={"Item"} count={setItemsCount} search={{ searchValues, setSearchValues }} />
      </ItemContext.Provider>
    </>
  );
}
