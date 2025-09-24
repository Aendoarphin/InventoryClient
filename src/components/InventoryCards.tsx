import useCounts from "@/hooks/useCounts";
import { IconInfoCircle, IconPencil } from "@tabler/icons-react";

function InventoryCards() {
  const { itemCount, vendorCount, loading, error} = useCounts();

  const tables = [
    {
      name: "Items",
      tooltip: "Includes hardware, furniture, or any tangible items.",
      total: loading || error ? 0 : itemCount,
    },
    {
      name: "Vendors",
      tooltip: "External suppliers and service providers",
      total: loading || error ? 0 : vendorCount,
    },
  ]
  
  return (
    <>
      {itemCount ? tables.map((table, index) => (
        <div
          className="min-h-40 p-4 flex flex-col justify-between border border-muted"
          key={index}
        >
          <h2 className="flex justify-between items-center">
            {table.name} <IconInfoCircle title={table.tooltip} />
          </h2>
          <div className="flex flex-row gap-8 justify-between items-end-safe">
            <div>
              <h6>Total</h6>
              <p>{table.total}</p>
            </div>
            <a
              href={`manage/${table.name.toLowerCase()}`}
              className="h-min *:place-self-center hover:text-primary"
            >
              <IconPencil />
              <p>Manage</p>
            </a>
          </div>
        </div>
      )): null}
    </>
  );
}

export default InventoryCards;
