import useCounts from "@/hooks/useCounts";
import Loader from "./Loader";
import Dashboard from "./Dashboard";

function Home() {
  const { itemCount, vendorCount, loading } = useCounts();

  if (!itemCount || !vendorCount || loading) return <Loader />;

  return (
    <>
      <Dashboard itemCount={itemCount} vendorCount={vendorCount} />
    </>
  );
}

export default Home;
