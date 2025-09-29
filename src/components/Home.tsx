import useCounts from "@/hooks/useCounts";
import { IconInfoCircle, IconPencil } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import Loader from "./Loader";

function Home() {
  const { itemCount, vendorCount, loading, error} = useCounts();

  const tables = [
    {
      name: "Item",
      tooltip: "Includes hardware, furniture, or any tangible items.",
      total: loading || error ? 0 : itemCount,
    },
    {
      name: "Vendor",
      tooltip: "External suppliers and service providers",
      total: loading || error ? 0 : vendorCount,
    },
  ]

  if (!itemCount) return <Loader/>;
  
  return (
    <>
      {tables.map((table, index) => (
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
            <Link
              to={'/manage/' + table.name}
              className="h-min *:place-self-center hover:text-primary"
            >
              <IconPencil />
              <p>Manage</p>
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

export default Home;
