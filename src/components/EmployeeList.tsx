import useEmployees from "@/hooks/useEmployees";
import useResourceAssociations from "@/hooks/useResourceAssociations";
import useResources from "@/hooks/useResources";
import type { Employee, Resource, ResourceAssociation } from "@/types";
import { useEffect, useState } from "react";

type FormData = Omit<Employee, "id">;

const EMPTY_FORM: FormData = {
  first: "",
  last: "",
  jobTitle: "",
  branch: "",
  startDate: "",
  endDate: "",
  created: "",
};

const SUCCESS_DURATION = 5000;

function EmployeeList() {
  const employees: Employee[] = useEmployees();
  const { resources }: { resources: Resource[] } = useResources();

  const [employeeType, setEmployeeType] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  const accessItems: ResourceAssociation[] = useResourceAssociations(employee?.id);

  // Filtered employees list
  let filteredEmployees = employees;

  // Filter by employment status
  if (employeeType === "active") {
    filteredEmployees = filteredEmployees.filter((e: Employee) => !e.endDate);
  } else if (employeeType === "inactive") {
    filteredEmployees = filteredEmployees.filter((e: Employee) => e.endDate);
  }

  // Filter by search term (name search)
  if (searchTerm) {
    const lowerSearch = searchTerm.toLowerCase();
    filteredEmployees = filteredEmployees.filter((e: Employee) => `${e.first} ${e.last}`.toLowerCase().includes(lowerSearch));
  }

  // Convert ISO date to input date format
  const toInputDate = (isoDate: string) => (isoDate ? new Date(isoDate).toISOString().split("T")[0] : "");

  // Update form when employee selection changes
  useEffect(() => {
    if (employee) {
      setFormData({
        first: employee.first,
        last: employee.last,
        jobTitle: employee.jobTitle,
        branch: employee.branch,
        startDate: toInputDate(employee.startDate),
        endDate: toInputDate(employee.endDate),
        created: toInputDate(employee.created),
      });
    }
  }, [employee]);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), SUCCESS_DURATION);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleEmployeeClick = (e: Employee) => {
    // Cleanup Staged Data
    setEmployee(e);
    setSuccess(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto text-sm">
      <div className="flex flex-row justify-between items-baseline">
        <h2>Employees</h2>
        <input className="font-bold text-success hover:underline" type="button" value={"+ Add New Employee"} />
      </div>
      <div className="grid grid-cols-5 gap-2 *:bg-card *:border *:border-muted *:shadow-md">
        {/* Employee List Sidebar */}
        <div className="col-span-1 overflow-y-auto w-full *:flex">
          <div className="flex-row text-xs sticky top-0 bg-card border-b border-muted z-10">
            <input onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2" type="search" placeholder="Search employee..." value={searchTerm} />
            <select value={employeeType} onChange={(e) => setEmployeeType(e.target.value)} className="w-full p-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="flex-col">
            {filteredEmployees.length === 0 && <div className="p-2 text-muted">No Employees Found</div>}
            {filteredEmployees.map((e: Employee) => (
              <button onClick={() => handleEmployeeClick(e)} key={e.id} className={`hover:bg-primary/25 border-b border-muted last-of-type:border-none font-bold text-start p-2 justify-start ${employee?.id === e.id ? "bg-primary/10" : ""}`}>
                <div className="flex flex-row items-baseline gap-2">
                  <p className="flex-1">
                    {e.first} {e.last}
                  </p>
                  <p className="text-xs text-muted">{e.jobTitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Employee Details Panel */}
        <div className="flex flex-col col-span-4 w-full p-4">
          <div className="flex flex-col h-full">
            <h5 className="flex items-center">
              Details
              {success && <span className="ml-auto text-xs text-success">Employee Updated Successfully</span>}
            </h5>
            <div className="grid grid-cols-2 gap-4 border-t border-muted pt-2 **:disabled:bg-muted/20 **:disabled:text-muted">
              <div>
                <strong>First Name</strong>
                <input type="text" value={formData.first} onChange={(e) => handleInputChange("first", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Last Name</strong>
                <input type="text" value={formData.last} onChange={(e) => handleInputChange("last", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Start Date</strong>
                <input type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong className="flex items-center gap-2">End Date</strong>
                <input type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Job Title</strong>
                <input type="text" value={formData.jobTitle} onChange={(e) => handleInputChange("jobTitle", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Created Date</strong>
                <input type="text" value={formData.created.length > 0 ? new Date(formData.created).toLocaleDateString() : ""} disabled className="w-full mt-1 p-1 border border-muted bg-muted/20 text-muted" />
              </div>
              <div>
                <strong>Branch</strong>
                <input type="text" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
            </div>
            <br />
          </div>
          <h5>Access</h5>
          <div className="min-h-64 max-h-64 overflow-y-auto border border-muted">
            <div className="">
              <div className="p-1 sticky top-0 bg-card border-b border-muted flex flex-row shadow-sm">
                <p className="w-107">Name</p>
                <p className="w-76">Granted</p>
                <p className="w-76">Revoked</p>
                <p className="w-20">Status</p>
              </div>
              {employee &&
                resources
                  .sort((a, b) => (a.name < b.name ? -1 : 1))
                  .map((r, index) => {
                    // Set of resource IDs of employee's active accesss items
                    const accessItemIds: number[] = [];
                    accessItems.forEach((e) => accessItemIds.push(e.resourceId));

                    return (
                      <div className="border-b border-muted last:border-0 flex flex-row justify-between items-center p-1 hover:bg-muted/25" key={index}>
                        <div className="w-50 max-w-50 overflow-ellipsis text-nowrap overflow-hidden">{r.name}</div>
                        <p className="text-muted">{"mm/dd/yyyy"}</p>
                        <p className="text-muted">{"mm/dd/yyyy"}</p>
                        <div className="gap-2 flex items-center">
                          <input type="radio" name={`rb-status-${index}`} id={`rb-active-${index}`} checked={r.id === accessItemIds.find((e) => e === r.id)} />
                          <label htmlFor={`rb-active-${index}`}>Active</label>
                          <input type="radio" name={`rb-status-${index}`} id={`rb-inactive-${index}`} />
                          <label htmlFor={`rb-inactive-${index}`}>Inactive</label>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
          <br />
          <div id="confirmation-container" className="flex flex-row *:text-white *:p-2 gap-2 justify-end *:disabled:contrast-50">
            <button disabled={!employee} className="bg-danger interactive" type="button">
              Cancel
            </button>
            <button disabled={!employee} className="bg-success interactive" type="button">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
