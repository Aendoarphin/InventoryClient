import type { ResourceAssociation } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResourceAssociations(userId?: number): [ResourceAssociation[], React.Dispatch<React.SetStateAction<ResourceAssociation[]>>] {
  const [resourceAssociations, setResourceAssociations] = useState<ResourceAssociation[]>([]);

  useEffect(() => {
    async function fetchRa() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/EmployeeResourceAssociation${userId ? `/search?employeeId=${userId}` : ""}`);
        const ra = res.data;
        setResourceAssociations(JSON.parse(JSON.stringify(ra)));
      } catch (error) {
        console.error("Error fetching resource associations");
      }
    }
    fetchRa();
  }, []);

  return [resourceAssociations, setResourceAssociations];
}

export default useResourceAssociations;
