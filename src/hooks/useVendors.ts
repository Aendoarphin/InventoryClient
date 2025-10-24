import axios from "axios";
import { useEffect, useState } from "react";

export interface Vendor {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  fax: string;
  contact: string;
  email: string;
  website: string;
  productServiceArea: string;
  contractOnFile: string;
  critical: string;
  comments: string;
}

function useVendors(modified: boolean, searchValues: string) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  async function getVendors() {
    try {
      let response;
      const getAll = `https://${import.meta.env.VITE_WEBAPI_HOST}/api/Vendor`;
      const getSearched = `https://${import.meta.env.VITE_WEBAPI_HOST}/api/Vendor/search`;

      if (searchValues.length > 0) {
        response = await axios.get(
          getSearched,
          { params: { keyword: searchValues } }
        );
      } else {
        response = await axios.get(getAll)
      }

      if (response) {
        return response.data;
      }
    } catch (e) {
      console.error("Error");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const vendors = await getVendors();
      setVendors(vendors);
    }
    fetchData();
  }, [modified, searchValues]);
  return vendors;
}

export default useVendors;
