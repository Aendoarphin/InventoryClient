import useEmployees from "@/hooks/useEmployees";
import useResources from "@/hooks/useResources";
import { IconInfoCircle } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useState } from "react";

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

interface Resource {
  id: number;
  name: string;
  categoryId: number;
}

interface ResourceAssociations {
  id: number;
  resourceId: number;
  employeeId: number;
  created: number;
}

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
  const employeeList: Employee[] = useEmployees();
  const resourceList: Resource[] = useResources();

  const [employeeType, setEmployeeType] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [postEditAction, setPostEditAction] = useState("clear");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [assigned, setAssigned] = useState<Resource[]>([]);

  // Memoized filtered employees list
  const filteredEmployees = useMemo(() => {
    let employees = employeeList;

    // Filter by employment status
    if (employeeType === "active") {
      employees = employees.filter((e: Employee) => !e.endDate);
    } else if (employeeType === "inactive") {
      employees = employees.filter((e: Employee) => e.endDate);
    }

    // Filter by search term (name search)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      employees = employees.filter((e: Employee) => `${e.first} ${e.last}`.toLowerCase().includes(lowerSearch));
    }

    return employees;
  }, [employeeList, employeeType, searchTerm]);

  // Convert ISO date to input date format
  const toInputDate = useCallback((isoDate: string) => (isoDate ? new Date(isoDate).toISOString().split("T")[0] : ""), []);

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
  }, [employee, toInputDate]);

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), SUCCESS_DURATION);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleEmployeeClick = useCallback((e: Employee) => {
    setEmployee(e);
    setSuccess(false);
  }, []);

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleProcess = useCallback(() => {
    try {
      // Convert dates back to ISO format
      const processedData = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : "",
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : "",
        created: formData.created ? new Date(formData.created).toISOString() : "",
      };

      window.alert(JSON.stringify(processedData, null, 2));

      if (postEditAction === "clear") {
        setFormData(EMPTY_FORM);
        setEmployee(undefined);
      }

      setSuccess(true);
    } catch (error) {
      window.alert("Something went wrong");
      console.error("Error processing employee data:", error);
    }
  }, [formData, postEditAction]);

  return (
    <div>
      <div className="col-span-5 flex flex-row justify-between items-baseline">
        <h2>Employees</h2>
        <div className="flex flex-row gap-2 *:p-2 *:text-white text-xs *:shadow-sm *:active:shadow-none *:active:translate-y-0.5">
          <button className="bg-success" title="Add a new employee to the system">
            Add
          </button>
          <button disabled={!employee} className={`bg-danger ${!employee ? "contrast-50" : ""}`} title="Permanently remove employee from the system">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 h-[80vh] min-h-[80vh] *:bg-card *:border *:border-muted *:shadow-md">
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
            {filteredEmployees.length === 0 && <div className="p-2 text-muted-foreground">No Employees Found</div>}
            {filteredEmployees.map((e: Employee) => (
              <button onClick={() => handleEmployeeClick(e)} key={e.id} className={`hover:underline border-b border-muted last-of-type:border-none font-bold text-start p-2 justify-start ${employee?.id === e.id ? "bg-info/50" : ""}`}>
                <div className="flex flex-row items-baseline gap-2">
                  <p className="flex-1">
                    {e.first} {e.last}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.jobTitle}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Employee Details Panel */}
        <div className="flex flex-col col-span-4 w-full p-4">
          <div className="flex flex-col h-full">
            <h5 className="flex items-center">
              Employee Details
              {success && <span className="ml-auto text-xs text-success">Employee Updated Successfully</span>}
            </h5>

            <div className="grid grid-cols-3 py-2 border-t border-muted/50 gap-4 *:flex *:flex-col *:gap-2">
              <div>
                <div>
                  <strong>First Name</strong>
                  <input type="text" value={formData.first} onChange={(e) => handleInputChange("first", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
                <div>
                  <strong>Last Name</strong>
                  <input type="text" value={formData.last} onChange={(e) => handleInputChange("last", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
              </div>

              <div>
                <div>
                  <strong>Start Date</strong>
                  <input type="date" value={formData.startDate} onChange={(e) => handleInputChange("startDate", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
                <div>
                  <strong className="flex items-end gap-2">
                    End Date <IconInfoCircle className="w-4 inline" title="Provide a value to inactivate this employee, otherwise leave blank" />
                  </strong>
                  <input type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
              </div>

              <div>
                <div>
                  <strong>Job Title</strong>
                  <input type="text" value={formData.jobTitle} onChange={(e) => handleInputChange("jobTitle", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
                <div>
                  <strong>Created Date</strong>
                  <input type="text" value={new Date(formData.created).toLocaleDateString()} disabled className="w-full mt-1 p-1 border border-muted bg-muted/20 text-muted-foreground" />
                </div>
              </div>

              <div>
                <div>
                  <strong>Branch</strong>
                  <input type="text" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted disabled:bg-muted/20 disabled:text-muted-foreground" />
                </div>
              </div>
            </div>
            <br />
            <h5>Resource Privileges</h5>
            {/* Continue here, figure out what ui type for resource assignments */}
            <div className="py-2 border-t border-muted/50 h-full flex flex-col border gap-4"></div>

            <div className="flex flex-row items-center justify-end text-sm gap-1">
              <input type="radio" name="post-edit-actions" id="clear" value="clear" checked={postEditAction === "clear"} onChange={(e) => setPostEditAction(e.currentTarget.value)} />
              <label htmlFor="clear">Clear</label>

              <input type="radio" name="post-edit-actions" id="review" value="review" checked={postEditAction === "review"} onChange={(e) => setPostEditAction(e.currentTarget.value)} className="ml-4" />
              <label htmlFor="review">Review</label>

              <button className={`ml-4 p-2 bg-success active:shadow-none active:translate-y-0.5 text-white shadow-sm ${!employee ? "contrast-50" : ""}`} onClick={handleProcess} disabled={!employee}>
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
