import axios from "axios";
import { useEffect, useState } from "react";

function useCounts() {
  const [itemCount, setItemCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);

  useEffect(() => {
    async function setCounts() {
      const itemResponse = await axios.get(
        "https://localhost:7097/api/Item/count"
      );
      const vendorResponse = await axios.get(
        "https://localhost:7097/api/Vendor/count"
      );

      setItemCount(itemResponse.data);
      setVendorCount(vendorResponse.data);
    }
    setCounts();
  }, []);

  useEffect(() => {
    console.log("Item count updated:", itemCount);
  }, [itemCount]);

  useEffect(() => {
    console.log("Vendor count updated:", vendorCount);
  }, [vendorCount]);

  return { itemCount, vendorCount };
}

export default useCounts;
