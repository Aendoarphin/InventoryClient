import useAccessLevels from "@/hooks/useAccessLevels";
import useEmployees from "@/hooks/useEmployees";
import useResourceAssociations from "@/hooks/useResourceAssociations";
import useResources from "@/hooks/useResources";
import { baseApiUrl } from "@/static";
import type { AccessLevel, Employee, Resource, ResourceAssociation } from "@/types";
import { IconInfoCircle, IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import NewEmployeeForm from "./NewEmployeeForm";
import { jsonToCsv } from "@/utils";

export type FormData = Omit<Employee, "id">;

export const EMPTY_FORM: FormData = {
  first: "",
  last: "",
  jobTitle: "",
  branch: "",
  startDate: "",
  endDate: "",
  created: "",
};

type AccessExport = {
  resource: string;
  access_level: string;
  granted: string;
  revoked: string;
};

const SUCCESS_DURATION = 5000;

let accessToExport: AccessExport[] = [];

function EmployeeList() {
  const [refetch, setRefetch] = useState(false);
  const employees: Employee[] = useEmployees(refetch);
  const { resources }: { resources: Resource[] } = useResources();
  const { accessLevels }: { accessLevels: AccessLevel[] } = useAccessLevels();

  const [employeeType, setEmployeeType] = useState("active"); // Active vs Inactive Employees
  const [employeeSort, setEmployeeSort] = useState("asc"); // AZ or ZA
  const [searchTermEmployee, setSearchTermEmployee] = useState(""); // Employee name query
  const [searchTermResource, setSearchTermResource] = useState(""); // Resource name query

  // Filters for access view panel
  const [filterAccessLevel, setFilterAccessLevel] = useState("");
  const [filterGranted, setFilterGranted] = useState("");
  const [filterRevoked, setFilterRevoked] = useState("");
  const [filterAction, setFilterAction] = useState("");
  const [resourceSort, setResourceSort] = useState("asc");

  const [employee, setEmployee] = useState<Employee>(); // Current selected employee
  const [success, setSuccess] = useState(false); // Success state for edit submission

  // Form states for access changes
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM); // Submittable form
  const [originalFormData, setOriginalFormData] = useState<FormData>(EMPTY_FORM); // Reference form

  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false); // To render new employee form
  const [review, setReview] = useState<boolean>(false); // Toggle for persisting info after submitting changes

  const [accessChanges, setAccessChanges] = useState<Map<number, "grant" | "revoke">>(new Map()); // Container for new access changes

  const accessItems: ResourceAssociation[] = useResourceAssociations(employee?.id, refetch); // All employee resource assignments

  let filteredEmployees = employees;

  if (employeeType === "active") {
    filteredEmployees = filteredEmployees.filter((e: Employee) => !e.endDate);
  } else if (employeeType === "inactive") {
    filteredEmployees = filteredEmployees.filter((e: Employee) => e.endDate);
  }

  if (employeeSort == "asc") {
    filteredEmployees.sort((a, b) => (a.first.toLowerCase() > b.first.toLowerCase() ? 0 : -1));
  } else if (employeeSort == "desc") {
    filteredEmployees.sort((a, b) => (a.first.toLowerCase() < b.first.toLowerCase() ? 0 : -1));
  }

  if (searchTermEmployee) {
    const lowerSearch = searchTermEmployee.toLowerCase();
    filteredEmployees = filteredEmployees.filter((e: Employee) => `${e.first} ${e.last}`.toLowerCase().includes(lowerSearch));
  }

  const toInputDate = (isoDate: string) => (isoDate ? new Date(isoDate).toISOString().split("T")[0] : "");

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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), SUCCESS_DURATION);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const clearAccessFilters = () => {
    setResourceSort("asc");
    setFilterAccessLevel("");
    setFilterGranted("");
    setFilterRevoked("");
    setFilterAction("");
  };

  const handleEmployeeClick = (e: Employee) => {
    setEmployee(e);
    setSuccess(false);
    setAccessChanges(new Map());
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasEmployeeInfoChanged = () => {
    if (!employee) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  };

  const hasChanges = () => {
    return hasEmployeeInfoChanged() || accessChanges.size > 0;
  };

  const toggleAccess = (resourceId: number, currentAccess: boolean) => {
    setAccessChanges((prev) => {
      const newMap = new Map(prev);
      const action = currentAccess ? "revoke" : "grant";

      if (newMap.get(resourceId) === action) {
        newMap.delete(resourceId);
      } else {
        newMap.set(resourceId, action);
      }

      return newMap;
    });
  };

  const saveAccessChanges = async () => {
    try {
      if (!employee) return;

      interface IChangeDetail {
        from: string;
        to: string;
      }

      interface IEmployeeInfo {
        first?: IChangeDetail;
        last?: IChangeDetail;
        jobTitle?: IChangeDetail;
        branch?: IChangeDetail;
        startDate?: IChangeDetail;
        endDate?: IChangeDetail;
      }

      interface IAccessChange {
        resourceId: number;
        resourceName: string;
        action: "grant" | "revoke";
        granted: string | undefined;
        revoked: string | undefined | null;
      }

      interface IEmployeeUpdate {
        employeeId: number;
        employeeName: string;
        employeeInfo?: IEmployeeInfo;
        accessChanges?: IAccessChange[];
        [key: string]: any;
      }

      const changesToProcess: IEmployeeUpdate = {
        employeeId: employee.id,
        employeeName: `${employee.first} ${employee.last}`,
      };

      if (hasEmployeeInfoChanged()) {
        const employeeChanges: any = {};
        (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
          if (formData[key] !== originalFormData[key]) {
            employeeChanges[key] = {
              from: originalFormData[key],
              to: formData[key],
            };
          }
        });
        changesToProcess.employeeInfo = employeeChanges;
      }

      if (accessChanges.size > 0) {
        changesToProcess.accessChanges = Array.from(accessChanges.entries()).map(([resourceId, action]) => {
          const resource = resources.find((r) => r.id === resourceId);
          return {
            resourceId,
            resourceName: resource?.name || "Unknown",
            action,
            granted: action === "grant" ? new Date().toISOString() : undefined,
            revoked: action === "revoke" ? new Date().toISOString() : null,
          };
        });
      }

      if (changesToProcess.accessChanges) {
        let response: AxiosResponse<any, any, {}> | undefined = undefined;

        for (const currentAccessChange of changesToProcess.accessChanges) {
          const previousAccess = accessItems.find((item) => item.resourceId === currentAccessChange.resourceId);

          if (!previousAccess) {
            console.log(`No access association found for resourceId: ${currentAccessChange.resourceId}\nAdding new records...`);

            const newAccess: ResourceAssociation = {
              id: 0,
              resourceId: currentAccessChange.resourceId,
              employeeId: employee.id,
              granted: new Date().toISOString(),
              revoked: null,
              created: new Date().toISOString(),
            };

            await axios.post(baseApiUrl + `/api/EmployeeResourceAssociation`, newAccess);

            continue;
          }

          const originalGrantDate = previousAccess.granted;
          const originalRevokeDate = previousAccess.revoked;
          const originalCreateDate = previousAccess.created;
          const accessId = previousAccess.id;

          const payload: ResourceAssociation = {
            id: accessId,
            resourceId: currentAccessChange.resourceId,
            employeeId: changesToProcess.employeeId,
            granted: currentAccessChange.granted || originalGrantDate,
            revoked: currentAccessChange.revoked !== undefined ? currentAccessChange.revoked : originalRevokeDate,
            created: originalCreateDate || new Date().toISOString(),
          };

          console.log(payload);
          response = await axios.put(baseApiUrl + `/api/EmployeeResourceAssociation?id=${accessId}`, payload);
          console.log(`Result for access change on resourceId ${currentAccessChange.resourceId}: ${response?.status}`);
        }
      }

      if (changesToProcess.employeeInfo) {
        const toDateStr = changesToProcess.employeeInfo.startDate?.to || "";
        const newDate = toDateStr.length > 0 ? new Date(toDateStr).toISOString() : undefined;

        const toEndDateStr = changesToProcess.employeeInfo.endDate?.to || "";
        const newEndDate = toEndDateStr.length > 0 ? new Date(toEndDateStr).toISOString() : "";

        const payload = {
          id: employee.id,
          first: changesToProcess.employeeInfo.first?.to || employee.first,
          last: changesToProcess.employeeInfo.last?.to || employee.last,
          branch: changesToProcess.employeeInfo.branch?.to || employee.branch,
          jobTitle: changesToProcess.employeeInfo.jobTitle?.to || employee.jobTitle,
          startDate: newDate || employee.startDate,
          endDate: newEndDate.length === 0 ? null : newEndDate,
          created: employee.created,
        };

        const response = await axios.put(baseApiUrl + `/api/Employee?id=${employee.id}`, payload);
        response.status > 300 ? console.error(response.statusText) : null;
      }

      setRefetch(!refetch);
      setAccessChanges(new Map());
      setOriginalFormData(formData);
      setSuccess(true);

      if (!review) setEmployee(undefined);
    } catch (error) {
      console.log(error);
      window.alert(error);
    }
  };

  const processRow = () => {
    accessToExport = [];

    if (!employee || !resources) return null;

    const activeResources = resources.filter((r) => r.active === 1);
    const sortedResources = [...activeResources].sort((a, b) => {
      if (resourceSort === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    const normalizedSearch = searchTermResource.trim().toLowerCase();

    return sortedResources.map((r) => {
      const hasAccess = accessItems.some((item) => item.resourceId === r.id && !item.revoked);
      const pendingChange = accessChanges.get(r.id);

      const effectiveAccess = pendingChange === "grant" ? true : pendingChange === "revoke" ? false : hasAccess;

      const grantedIso = accessItems.find((item) => item.employeeId === employee.id && item.resourceId === r.id)?.granted;
      const granted = grantedIso ? (grantedIso instanceof Date ? grantedIso : new Date(grantedIso)).toLocaleDateString() : "";

      const revokedIso = accessItems.find((item) => item.employeeId === employee.id && item.resourceId === r.id)?.revoked;
      const revoked = revokedIso ? (revokedIso instanceof Date ? revokedIso : new Date(revokedIso)).toLocaleDateString() : "";

      const accessLevel = accessLevels.find((e) => e.id === r.accessLevelId)?.name || "Resource was disabled at time of export";

      if (normalizedSearch) {
        const matchesResourceName = r.name.toLowerCase().includes(normalizedSearch);
        const matchesAccessLevel = accessLevel?.toLowerCase().includes(normalizedSearch);

        if (!matchesResourceName && !matchesAccessLevel) {
          return null;
        }
      }

      if (filterAccessLevel && accessLevel !== filterAccessLevel) {
        return null;
      }

      if (filterGranted === "yes" && !granted) {
        return null;
      }
      if (filterGranted === "no" && granted) {
        return null;
      }

      if (filterRevoked === "yes" && !revoked) {
        return null;
      }
      if (filterRevoked === "no" && revoked) {
        return null;
      }

      if (filterAction === "active" && !effectiveAccess) {
        return null;
      }
      if (filterAction === "inactive" && effectiveAccess) {
        return null;
      }

      accessToExport.push({ resource: r.name, access_level: accessLevel, granted, revoked });

      return (
        <tr key={r.id} className={`border-b border-muted last:border-0 hover:bg-muted/25 *:text-nowrap *:my-2 ${pendingChange ? "bg-primary/10" : ""}`}>
          <td className="p-1 overflow-ellipsis text-nowrap overflow-hidden w-full">{r.name}</td>
          <td className="p-1 text-muted min-w-30">{accessLevel}</td>
          <td className="p-1 text-muted min-w-30">{granted}</td>
          <td className="p-1 text-muted min-w-30">{revoked}</td>
          <td className="p-1 font-bold">
            {effectiveAccess ? (
              <button onClick={() => toggleAccess(r.id, hasAccess)} className={`text-danger ${pendingChange === "revoke" ? "underline" : ""}`}>
                Inactivate {pendingChange === "revoke" && "(Pending)"}
              </button>
            ) : (
              <button onClick={() => toggleAccess(r.id, hasAccess)} className={`text-success ${pendingChange === "grant" ? "underline" : ""}`}>
                Activate {pendingChange === "grant" && "(Pending)"}
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  const uniqueAccessLevels = Array.from(new Set(accessLevels.filter((al) => al.active).map((al) => al.name))).sort();

  return (
    <div className="container mx-auto text-sm">
      <div className="flex flex-row justify-between items-baseline">
        <h2>Employees</h2>
        <div className="inline-flex items-center gap-4">
          <input className="font-bold text-success hover:underline" type="button" value={"+ Add New Employee"} onClick={() => setShowNewEmployeeForm(true)} />
          <input className="font-bold hover:underline" type="button" value="Export CSV" onClick={() => jsonToCsv(employees, "employees_" + new Date().toISOString() + ".csv")} />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 *:bg-card *:border *:border-muted *:shadow-md">
        <div className="col-span-1 overflow-y-auto w-full *:flex">
          <div className="flex-row items-center text-xs sticky top-0 bg-card border-b border-muted z-10">
            <input onChange={(e) => setSearchTermEmployee(e.target.value)} className="w-full p-2" type="search" placeholder="Search employee..." value={searchTermEmployee} />
            <select
              value={employeeType}
              onChange={(e) => {
                setEmployeeType(e.target.value);
                setEmployee(undefined);
                setFormData(EMPTY_FORM);
              }}
              className="w-full p-2 cursor-pointer"
            >
              <option value="active">Active &#40;{employees.filter((e) => !e.endDate).length}&#41;</option>
              <option value="inactive">Inactive &#40;{employees.filter((e) => e.endDate).length}&#41;</option>
              <option value="all">All &#40;{employees.length}&#41;</option>
            </select>
            <button className="px-2 contrast-2 hover:contrast-100" onClick={() => (employeeSort === "desc" ? setEmployeeSort("asc") : employeeSort === "asc" ? setEmployeeSort("desc") : null)}>
              {employeeSort === "asc" ? <IconSortAscending size={20} /> : <IconSortDescending size={20} />}
            </button>
          </div>

          <div className="flex-col max-h-170">
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

        <div className="flex flex-col col-span-4 w-full p-4">
          <div className="flex flex-col h-full">
            <h5 className="flex items-center">
              Details
              {hasEmployeeInfoChanged() && <span className="ml-2 text-xs text-primary">(Modified)</span>}
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
                <input type="text" value={formData.created.length > 0 || employee?.endDate ? new Date(formData.created).toLocaleDateString() : "mm/dd/yyyy"} disabled className="w-full mt-1 p-1 border border-muted bg-muted/20 text-muted" />
              </div>
              <div>
                <strong>Branch</strong>
                <input type="text" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
            </div>
            <br />
          </div>
          <div className="flex flex-row items-baseline justify-between gap-2">
            <h5 className="flex items-center gap-2">
              Access
              {accessChanges.size > 0 && (
                <span className="text-xs text-primary">
                  ({accessChanges.size} pending change{accessChanges.size !== 1 ? "s" : ""})
                </span>
              )}
            </h5>
            <div hidden={!employee} className="flex items-center gap-2 text-xs">
              <button className="p-1 font-bold border border-muted shadow-sm active:shadow-none active:translate-y-0.5" onClick={clearAccessFilters}>
                Clear Filters
              </button>
              <button className="p-1 font-bold border border-muted shadow-sm active:shadow-none active:translate-y-0.5" onClick={() => jsonToCsv(accessToExport, (employee ? employee.first + employee.last : "employee") + new Date().toISOString() + ".csv")}>
                Export CSV
              </button>
              <input onChange={(e) => setSearchTermResource(e.target.value)} className="p-1 border border-muted min-w-46" type="search" placeholder="Search resource or access level..." value={searchTermResource} />
            </div>
          </div>
          <div className="min-h-64 max-h-64 overflow-y-auto border border-muted">
            <table className="w-full">
              <thead className="sticky top-0 bg-card border-muted shadow-sm">
                {/* Resource column headers */}
                <tr className="*:p-1 *:text-left">
                  <th>Name</th>
                  <th>
                    Access Level <IconInfoCircle size={10} className="inline" title="The minimum level access needed for employee to use the resource" />
                  </th>
                  <th>Granted</th>
                  <th>Revoked</th>
                  <th>Action</th>
                </tr>
                {/* Resource column filters */}
                <tr className="bg-card" hidden={!employee}>
                  <th className="min-w-30">
                    <select id="resource-name-filter" value={resourceSort} onChange={(e) => setResourceSort(e.target.value)} className="w-full text-xs cursor-pointer border border-muted">
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </th>
                  <th>
                    <select id="resource-access-level-filter" value={filterAccessLevel} onChange={(e) => setFilterAccessLevel(e.target.value)} className="w-full text-xs cursor-pointer border border-muted">
                      <option value="">All</option>
                      {uniqueAccessLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </th>
                  <th>
                    <select id="resource-granted-filter" value={filterGranted} onChange={(e) => setFilterGranted(e.target.value)} className="w-full text-xs cursor-pointer border border-muted">
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </th>
                  <th>
                    <select id="resource-revoked-filter" value={filterRevoked} onChange={(e) => setFilterRevoked(e.target.value)} className="w-full text-xs cursor-pointer border border-muted">
                      <option value="">All</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </th>
                  <th>
                    <select id="resource-action-filter" value={filterAction} onChange={(e) => setFilterAction(e.target.value)} className="w-full text-xs cursor-pointer border border-muted">
                      <option value="">All</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </th>
                </tr>
              </thead>
              <tbody>{processRow()}</tbody>
            </table>
          </div>
          <br />
          <div id="confirmation-container" className="flex flex-row *:text-white *:p-2 gap-2 justify-end *:disabled:contrast-50">
            <div className="flex flex-row gap-2 *:text-black">
              <input type="radio" name="rb-group" id="rb-clear" onClick={() => setReview(false)} checked={!review} />
              <label htmlFor="rb-clear">Clear</label>
              <input type="radio" name="rb-group" id="rb-review" onClick={() => setReview(true)} checked={review} />
              <label htmlFor="rb-review">Review</label>
            </div>
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
            <button disabled={!employee || !hasChanges()} onClick={saveAccessChanges} className="bg-success interactive" type="button">
              Save Changes
              {hasChanges() && ` (${accessChanges.size > 0 && hasEmployeeInfoChanged() ? "Info + Access" : accessChanges.size > 0 ? `${accessChanges.size} Access` : "Info"})`}
            </button>
          </div>
        </div>
      </div>
      {showNewEmployeeForm && <NewEmployeeForm setVisible={setShowNewEmployeeForm} employees={{ refetch, setRefetch }} />}
    </div>
  );
}

export default EmployeeList;
