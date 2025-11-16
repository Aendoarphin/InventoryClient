import useEmployees from "@/hooks/useEmployees";
import useResourceAssociations from "@/hooks/useResourceAssociations";
import useResources from "@/hooks/useResources";
import type { Employee, Resource, ResourceAssociation } from "@/types";
import axios from "axios";
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
  const [searchTermEmployee, setSearchTermEmployee] = useState("");
  const [searchTermAccess, setSearchTermAccess] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [originalFormData, setOriginalFormData] = useState<FormData>(EMPTY_FORM);
  
  // Track access changes with a Map: resourceId -> 'grant' | 'revoke' | null
  const [accessChanges, setAccessChanges] = useState<Map<number, 'grant' | 'revoke'>>(new Map());

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
  if (searchTermEmployee) {
    const lowerSearch = searchTermEmployee.toLowerCase();
    filteredEmployees = filteredEmployees.filter((e: Employee) => `${e.first} ${e.last}`.toLowerCase().includes(lowerSearch));
  }

  // Convert ISO date to input date format
  const toInputDate = (isoDate: string) => (isoDate ? new Date(isoDate).toISOString().split("T")[0] : "");

  // Update form when employee selection changes
  useEffect(() => {
    if (employee) {
      const formState = {
        first: employee.first,
        last: employee.last,
        jobTitle: employee.jobTitle,
        branch: employee.branch,
        startDate: toInputDate(employee.startDate),
        endDate: toInputDate(employee.endDate),
        created: toInputDate(employee.created),
      };
      setFormData(formState);
      setOriginalFormData(formState);
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
    setEmployee(e);
    setSuccess(false);
    setAccessChanges(new Map()); // Clear pending changes
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if employee info has changed
  const hasEmployeeInfoChanged = () => {
    if (!employee) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  // Check if there are any changes to save
  const hasChanges = () => {
    return hasEmployeeInfoChanged() || accessChanges.size > 0;
  };

  const toggleAccess = (resourceId: number, currentAccess: boolean) => {
    setAccessChanges((prev) => {
      const newMap = new Map(prev);
      const action = currentAccess ? 'revoke' : 'grant';
      
      // Toggle: if same action is clicked again, remove it
      if (newMap.get(resourceId) === action) {
        newMap.delete(resourceId);
      } else {
        newMap.set(resourceId, action);
      }
      
      return newMap;
    });
  };

  const saveAccessChanges = async() => {
    try {
      if (!employee) return;

    const changesToProcess: any = {
      employeeId: employee.id,
      employeeName: `${employee.first} ${employee.last}`,
    };

    // Include employee info changes if any
    if (hasEmployeeInfoChanged()) {
      const employeeChanges: any = {};
      (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
        if (formData[key] !== originalFormData[key]) {
          employeeChanges[key] = {
            from: originalFormData[key],
            to: formData[key]
          };
        }
      });
      changesToProcess.employeeInfo = employeeChanges;
    }

    // Include access changes if any
    if (accessChanges.size > 0) {
      changesToProcess.accessChanges = Array.from(accessChanges.entries()).map(([resourceId, action]) => {
        const resource = resources.find(r => r.id === resourceId);
        return {
          resourceId,
          resourceName: resource?.name || 'Unknown',
          action
        };
      });
    }

    // Log to console
    console.log('Changes to Process:', changesToProcess);
    
    // Also show in alert for testing
    window.alert(JSON.stringify(changesToProcess, null, 2));

    // Perform API calls
    if (changesToProcess.accessChanges) {
      // Perform PUT
    }

    // Clear changes after processing
    setAccessChanges(new Map());
    setOriginalFormData(formData);
    setSuccess(true);
    } catch (error) {
      console.log(error)
    }
  };

  const processRow = () => {
    if (!employee || !resources) return null;

    const sortedResources = [...resources].sort((a, b) => a.name.localeCompare(b.name));
    const accessItemIds = accessItems.map((item) => item.resourceId);
    const normalizedSearch = searchTermAccess.trim().toLowerCase();

    return sortedResources.map((r) => {
      const hasAccess = accessItemIds.includes(r.id);
      const pendingChange = accessChanges.get(r.id);
      
      // Calculate effective state after pending changes
      const effectiveAccess = pendingChange === 'grant' ? true : pendingChange === 'revoke' ? false : hasAccess;

      const grantedIso = accessItems.find((item) => item.employeeId === employee.id && item.resourceId === r.id)?.granted;
      const granted = grantedIso ? (grantedIso instanceof Date ? grantedIso : new Date(grantedIso)).toLocaleDateString() : "";

      // Search filter
      const filteredOut = normalizedSearch && !r.name.toLowerCase().includes(normalizedSearch);
      if (filteredOut) return null;

      return (
        <tr key={r.id} className={`border-b border-muted last:border-0 hover:bg-muted/25 *:text-nowrap *:my-2 ${pendingChange ? 'bg-primary/10' : ''}`}>
          <td className="p-1 overflow-ellipsis text-nowrap overflow-hidden w-full">{r.name}</td>
          <td className="p-1 text-muted min-w-30">{granted}</td>
          <td className="p-1 text-muted min-w-30"></td>
          <td className="p-1 font-bold">
            {effectiveAccess ? (
              <button 
                onClick={() => toggleAccess(r.id, hasAccess)} 
                className={`text-danger ${pendingChange === 'revoke' ? 'underline' : ''}`}
              >
                Inactivate {pendingChange === 'revoke' && '(Pending)'}
              </button>
            ) : (
              <button 
                onClick={() => toggleAccess(r.id, hasAccess)} 
                className={`text-success ${pendingChange === 'grant' ? 'underline' : ''}`}
              >
                Activate {pendingChange === 'grant' && '(Pending)'}
              </button>
            )}
          </td>
        </tr>
      );
    });
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
            <input onChange={(e) => setSearchTermEmployee(e.target.value)} className="w-full p-2" type="search" placeholder="Search employee..." value={searchTermEmployee} />
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
              {hasEmployeeInfoChanged() && (
                <span className="ml-2 text-xs text-primary">(Modified)</span>
              )}
              {success && <span className="ml-auto text-xs text-success">Changes Saved Successfully</span>}
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
                <input type="text" value={formData.created.length > 0 ? new Date(formData.created).toLocaleDateString() : "mm/dd/yyyy"} disabled className="w-full mt-1 p-1 border border-muted bg-muted/20 text-muted" />
              </div>
              <div>
                <strong>Branch</strong>
                <input type="text" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
            </div>
            <br />
          </div>
          <div className="flex flex-row items-baseline justify-between">
            <h5 className="flex items-center gap-2">
              Access
              {accessChanges.size > 0 && (
                <span className="text-xs text-primary">
                  ({accessChanges.size} pending change{accessChanges.size !== 1 ? 's' : ''})
                </span>
              )}
            </h5>
            <input onChange={(e) => setSearchTermAccess(e.target.value)} className="p-1 text-xs border border-muted" type="search" placeholder="Search..." value={searchTermAccess} />
          </div>
          <div className="min-h-64 max-h-64 overflow-y-auto border border-muted">
            <table className="w-full">
              <thead className="sticky top-0 bg-card border-muted shadow-sm">
                <tr>
                  <th className="p-1 text-left">Name</th>
                  <th className="p-1 text-left">Granted</th>
                  <th className="p-1 text-left">Revoked</th>
                  <th className="p-1 text-left">Action</th>
                </tr>
              </thead>
              <tbody>{processRow()}</tbody>
            </table>
          </div>
          <br />
          <div id="confirmation-container" className="flex flex-row *:text-white *:p-2 gap-2 justify-end *:disabled:contrast-50">
            <button
              disabled={!employee}
              onClick={() => {
                setEmployee(undefined);
                setFormData(EMPTY_FORM);
                setOriginalFormData(EMPTY_FORM);
                setAccessChanges(new Map());
              }}
              className="bg-danger interactive"
              type="button"
            >
              Cancel
            </button>
            <button 
              disabled={!employee || !hasChanges()} 
              onClick={saveAccessChanges}
              className="bg-success interactive" 
              type="button"
            >
              Save Changes
              {hasChanges() && ` (${accessChanges.size > 0 && hasEmployeeInfoChanged() ? 'Info + Access' : accessChanges.size > 0 ? `${accessChanges.size} Access` : 'Info'})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;