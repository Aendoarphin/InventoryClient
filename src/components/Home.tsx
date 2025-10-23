import useCounts from "@/hooks/useCounts";
import Loader from "./Loader";
import Dashboard from "./Dashboard";

function Home() {
  const { itemCount, vendorCount, loading, error } = useCounts();

  if (!itemCount || !vendorCount || loading) return <Loader />;

  console.log(error)

  return (
    <>
      <Dashboard itemCount={itemCount} vendorCount={vendorCount} />
    </>
  );
}

export default Home;
