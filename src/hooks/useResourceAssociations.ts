import { baseApiUrl } from "@/static";
import type { ResourceAssociation } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResourceAssociations(employeeId: number | undefined, refetch?: boolean): ResourceAssociation[] {
  const [resourceAssociations, setResourceAssociations] = useState<ResourceAssociation[]>([]);

  useEffect(() => {
    async function fetchRa() {
      try {
        const res = await axios.get(`${baseApiUrl}/api/EmployeeResourceAssociation${employeeId ? `/search?employeeId=${employeeId}` : ""}`);
        const ra = res.data;
        setResourceAssociations(JSON.parse(JSON.stringify(ra)));
      } catch (error) {
        console.error("Error fetching resource associations");
      }
    }
    if (employeeId) fetchRa()
  }, [employeeId, refetch]);

  return resourceAssociations;
}

export default useResourceAssociations;
