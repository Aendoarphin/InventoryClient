import { baseApiUrl } from "@/static";
import type { Employee } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useEmployees(refetch? : boolean): Employee[] {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axios.get(`${baseApiUrl}/Api/Employee`);
        const employees = res.data;
        setEmployees(JSON.parse(JSON.stringify(employees)));
      } catch (error) {
        console.error("Error fetching employees");
      }
    }
    fetchEmployees();
  }, [refetch]);

  return employees;
}

export default useEmployees;
