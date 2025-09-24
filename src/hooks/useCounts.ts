import axios from "axios";
import { useEffect, useState } from "react";

function useCounts() {
  const [itemCount, setItemCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getCounts() {
      try {
        setLoading(true);
        const itemRes = await axios.get(
          `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/Item/count`
        );
        setItemCount(itemRes.data);
        const vendorRes = await axios.get(
          `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/Vendor/count`
        );
        setVendorCount(vendorRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    }
    getCounts();
  }, []);

  return { itemCount, vendorCount, loading, error };
}

export default useCounts;