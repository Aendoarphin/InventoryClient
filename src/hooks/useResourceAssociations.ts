import axios from "axios";
import { useEffect, useState } from "react";

function useResourceAssociations(userId? : number) {
  const [ra, setRa] = useState([]);

  useEffect(() => {
    async function fetchRa() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/EmployeeResourceAssociation${userId ? `/search?employeeId=${userId}` : ""}`);
        const ra = res.data;
        setRa(JSON.parse(JSON.stringify(ra)));
      } catch (error) { console.error("Error fetching resource associations") }
    }
    fetchRa();
  }, []);

  return ra;
}

export default useResourceAssociations;
