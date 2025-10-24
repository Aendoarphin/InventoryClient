import axios from "axios";
import { useEffect, useState } from "react";

function useEmployees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/Employee`);
        const employees = res.data;
        setEmployees(JSON.parse(JSON.stringify(employees)));
      } catch (error) { console.error("Error fetching employees") }
    }
    fetchEmployees();
  }, []);

  return employees;
}

export default useEmployees;
