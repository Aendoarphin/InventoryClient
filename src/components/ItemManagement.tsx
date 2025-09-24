import { useState } from "react";
import InventoryTable from "./InventoryTable";
import useItems from "@/hooks/useItems";

function ItemManagement() {
  const items = {
    name: "Items",
    data: useItems()
  }

  return (
    <div>
      <InventoryTable table={items.data} tableName={items.name} />
    </div>
  );
}

export default ItemManagement;
