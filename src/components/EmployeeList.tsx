import useEmployees from "@/hooks/useEmployees";
import { useEffect, useState } from "react";

interface Employee {
  id: number;
  first: string;
  last: string;
  branch: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  created: string;
}

function EmployeeList() {
  const employeeList: Employee[] = useEmployees();
  const columns = Object.keys({ ...employeeList[0] }).filter((e) => e.toLowerCase() !== "id");

  const [employeeType, setEmployeeType] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    employeeList.filter((e) => (e.first + " " + e.last).toLowerCase().includes(searchTerm));
  }, [searchTerm]);

  const active = employeeList.filter((e) => !e.endDate);
  const inactive = employeeList.filter((e) => e.endDate);

  return (
    <div>
      <div className="col-span-5 flex flex-row justify-between items-baseline">
        <h2>Employees</h2>
        <div id="employee-actions" className="flex flex-row gap-2 *:p-2 *:text-white text-xs *:shadow-lg *:active:shadow-none *:active:translate-y-0.5">
          <button className="bg-success" title="Add a new employee to the system">
            Add
          </button>
          <button className="bg-danger" title="Permanently remove employee (active/inactive) from the system">
            Delete
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 h-[80vh] min-h-[80vh] *:bg-card *:border *:border-muted *:shadow-md">
        <div className="col-span-1 overflow-y-scroll w-full *:flex">
          <div className="flex-row text-xs sticky top-0 bg-card border-b border-muted">
            <input onChange={(e) => setSearchTerm(e.currentTarget.value)} className="w-full p-2" type="search" placeholder="Search user..." />
            <select id="employee-filter-container" value={employeeType} onChange={(e) => setEmployeeType(e.currentTarget.value)}>
              <option value={"active"}>Active</option>
              <option value={"inactive"}>Inactive</option>
              <option value={"all"}>All</option>
            </select>
          </div>
          <div className="flex-col">
            {employeeList.length === 0 && <div className="p-4">No Employees</div>}
            {employeeType === "all" &&
              employeeList.map((e, index) => (
                <button key={index} className="hover:underline even:bg-muted/15 font-bold text-start p-2 justify-start gap-20">
                  <p>{e.first + " " + e.last}</p>
                </button>
              ))}
            {employeeType === "inactive" &&
              inactive.map((e, index) => (
                <button key={index} className="hover:underline even:bg-muted/15 font-bold text-start p-2 justify-start gap-20">
                  <p>{e.first + " " + e.last}</p>
                </button>
              ))}
            {employeeType === "active" &&
              active.map((e, index) => (
                <button key={index} className="hover:underline even:bg-muted/15 font-bold text-start p-2 justify-start gap-20">
                  <p>{e.first + " " + e.last}</p>
                </button>
              ))}
          </div>
        </div>
        <div className="flex flex-col col-span-4 w-full"></div>
      </div>
    </div>
  );
}

export default EmployeeList;
