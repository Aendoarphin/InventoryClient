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
  const [itemsCount, setItemsCount] = useState(0);
  const [modified, setModified] = useState(false);
  const [searchValues, setSearchValues] = useState("");

  const tableName = "Item";

  const items = useItems(modified, searchValues);

  return (
    <>
      <div className="mx-auto flex flex-row *:h-full justify-between items-center">
        <h2 className=" translate-y-2">Items</h2>
        <p className="text-muted">
          Showing {itemsCount} items out of {items.length}
        </p>
      </div>
      <ItemContext.Provider value={{ modified, setModified }}>
        <InventoryTable
          table={items}
          tableName={tableName}
          count={setItemsCount}
          search={{ searchValues, setSearchValues }}
        />
      </ItemContext.Provider>
    </>
  );
}
