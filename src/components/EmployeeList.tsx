import useEmployees from "@/hooks/useEmployees";
import useResources from "@/hooks/useResources";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

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

interface AccessItem {
  id: number;
  resourceId: number;
  employeeId: number;
  created: Date;
}

interface Resource {
  id: number;
  name: string;
  categoryId: number;
}

function EmployeeList() {
  const employeeList: Employee[] = useEmployees();
  const resourceList: Resource[] = useResources();
  const [employeeType, setEmployeeType] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [employee, setEmployee] = useState<Employee>();
  const [postEditAction, setPostEditAction] = useState("");

  const filteredEmployees = useMemo(() => {
    let employees = employeeList;

    // Filter by type
    if (employeeType === "active") {
      employees = employees.filter((e) => !e.endDate);
    } else if (employeeType === "inactive") {
      employees = employees.filter((e) => e.endDate);
    }

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      employees = employees.filter((e) => `${e.first}${e.last}`.toLowerCase().includes(lowerSearch));
    }

    return employees;
  }, [employeeList, employeeType, searchTerm, employee]);

  useEffect(() => {
    // fetch all resources
  }, [employee]);

  function resetRadioButtons() {
    const radioButtons: Record<string, HTMLInputElement | null> = {
      close: document.getElementById("close") as HTMLInputElement,
      clear: document.getElementById("clear") as HTMLInputElement,
      review: document.getElementById("review") as HTMLInputElement,
    };

    for (let k in radioButtons) {
      const rb: HTMLInputElement | null = radioButtons[k];
      if (rb) rb.checked = false;
    }
  }

  function handleEmployeeClick(e: Employee) {
    if (postEditAction.length > 0) setPostEditAction("");
    setVisible(true);
    setEmployee(e);
    resetRadioButtons();
  }

  function handleProcess() {
    if (postEditAction === "close") {
      setVisible(false);
      setPostEditAction("");
    }
    resetRadioButtons();
  }

  console.log(postEditAction);

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
        <div className="col-span-1 overflow-y-auto w-full *:flex">
          <div className="flex-row text-xs sticky top-0 bg-card border-b border-muted">
            <input onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2" type="search" placeholder="Search user..." />
            <select id="employee-filter-container" value={employeeType} onChange={(e) => setEmployeeType(e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="flex-col">
            {filteredEmployees.length === 0 && <div className="p-4">No Employees</div>}
            {filteredEmployees.map((e) => (
              <button onClick={() => handleEmployeeClick(e)} key={e.id} className="hover:underline even:bg-muted/15 font-bold text-start p-2 justify-start gap-20">
                <p>
                  {e.first} {e.last}
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col col-span-4 w-full p-4">
          <div hidden={!visible} className="flex flex-col h-full">
            <h5>Employee Details</h5>
            <div className="grid grid-cols-3 p-2 border-t border-muted/50">
              <p>
                <strong>First</strong>
                <br />
                {employee?.first}
                <br />
                <strong>Last</strong>
                <br />
                {employee?.last}
              </p>
              <p>
                <strong>Started</strong>
                <br />
                {(employee && new Date(employee?.startDate).toLocaleDateString()) || "N/A"}
                <br />
                <strong>Ended</strong>
                <br />
                {(employee && new Date(employee?.endDate).toLocaleDateString()) || "N/A"}
              </p>
              <p>
                <strong>Job Title</strong>
                <br />
                {employee?.jobTitle}
                <br />
                <strong>Created</strong>
                <br />
                {(employee && new Date(employee?.created).toLocaleDateString()) || "N/A"}
              </p>
            </div>
            <br />
            <h5>Access Items</h5>
            <div className="py-2 border-t border-muted/50 h-full overflow-y-auto flex flex-col">
              {/* insert resources */}
            </div>
            <div className="flex flex-row items-center justify-end text-sm">
              &nbsp;
              <input type="radio" name="post-edit-actions" id="close" value={"close"} onClick={(e) => setPostEditAction(e.currentTarget.value)} />
              &nbsp;
              <label htmlFor="close">Close</label>
              &nbsp;
              <input type="radio" name="post-edit-actions" id="clear" value={"clear"} onClick={(e) => setPostEditAction(e.currentTarget.value)} />
              &nbsp;
              <label htmlFor="clear">Clear</label>
              &nbsp;
              <input type="radio" name="post-edit-actions" id="review" value={"review"} onClick={(e) => setPostEditAction(e.currentTarget.value)} />
              &nbsp;
              <label htmlFor="review">Review</label>
              <button className="ml-2 p-2 bg-success text-white shadow-md" onClick={handleProcess}>
                Process
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
