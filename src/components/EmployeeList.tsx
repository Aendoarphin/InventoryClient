import useAccessLevels from "@/hooks/useAccessLevels";
import useEmployees from "@/hooks/useEmployees";
import useResourceAssociations from "@/hooks/useResourceAssociations";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import type { AccessLevel, Employee, Resource, ResourceAssociation, ResourceCategory } from "@/types";
import { IconInfoCircle, IconMinus } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";

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

const DEFAULT_FILTER_VALUES = {
  category: "all",
  accessLevel: "all",
  status: "granted",
};

const SUCCESS_DURATION = 5000;

function EmployeeList() {
  const employees: Employee[] = useEmployees();

  const [employeeType, setEmployeeType] = useState("active");
  const [accessCategory, setAccessCategory] = useState("all");
  const [accessLevel, setAccessLevel] = useState("all");
  const [accessStatus, setAccessStatus] = useState("granted");
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [postEditAction, setPostEditAction] = useState("clear");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [refetch, setRefetch] = useState(false);
  const [toRevoke, setToRevoke] = useState<number[]>([]);
  const [toGrant, setToGrant] = useState<number[]>([]);
  const [revokedItems, setRevokedItems] = useState([]);
  const [grantedItems, setGrantedItems] = useState([]);

  const employeeRa: ResourceAssociation[] = useResourceAssociations(employee?.id, refetch);
  const accessLevels: AccessLevel[] = useAccessLevels().accessLevels.filter((al) => al.active);
  const { resources }: { resources: Resource[] } = useResources();
  const { resourceCategories }: { resourceCategories: ResourceCategory[] } = useResourceCategories();

  // Lookup maps
  const resourcesById = useMemo(() => {
    return resources.reduce(
      (acc, resource) => {
        acc[resource.id] = resource;
        return acc;
      },
      {} as Record<number, Resource>
    );
  }, [resources]);

  const accessLevelsById = useMemo(() => {
    return accessLevels.reduce(
      (acc, level) => {
        acc[level.id] = level;
        return acc;
      },
      {} as Record<number, AccessLevel>
    );
  }, [accessLevels]);

  const resourceCategoriesById = useMemo(() => {
    return resourceCategories.reduce(
      (acc, rc) => {
        acc[rc.id] = rc;
        return acc;
      },
      {} as Record<number, ResourceCategory>
    );
  }, [accessLevels]);

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
    setEmployee(e);
    setSuccess(false);
    setAccessCategory(DEFAULT_FILTER_VALUES.category);
    setAccessLevel(DEFAULT_FILTER_VALUES.accessLevel);
    setAccessStatus(DEFAULT_FILTER_VALUES.status);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProcess = () => {
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
        setToRevoke([]);
        setToGrant([]);
      }

      setSuccess(true);
    } catch (error) {
      window.alert("Something went wrong");
      console.error("Error processing employee data:", error);
    }
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
            <div className="flex flex-row justify-between items-baseline">
              <h5>Access Management</h5>
              <div id="resource-filter-container" className="text-xs *:disabled:text-muted">
                <label htmlFor="resource-category-filter">Category: </label>
                <select disabled={!employee} className="border border-muted" name="resource-category-filter" id="resource-category-filter" value={accessCategory} onChange={(e) => setAccessCategory(e.currentTarget.value)}>
                  <option value={"all"}>All</option>
                  {useResourceCategories()
                    .resourceCategories.filter((e) => e.active === 1)
                    .map((rc: ResourceCategory, i) => (
                      <option key={i} value={rc.name.toLowerCase()}>
                        {rc.name}
                      </option>
                    ))}
                </select>
                &nbsp;&nbsp;
                <label htmlFor="access-level-filter">Access Level: </label>
                <select disabled={!employee} className="border border-muted" name="access-level-filter" id="access-level-filter" value={accessLevel} onChange={(e) => setAccessLevel(e.currentTarget.value)}>
                  {accessLevels.map((rc: ResourceCategory, i) => (
                    <option key={i} value={rc.name.toLowerCase()}>
                      {rc.name}
                    </option>
                  ))}
                </select>
                &nbsp;&nbsp;
                <label htmlFor="access-status-filter">Status: </label>
                <select disabled={!employee} className="border border-muted" name="access-status-filter" id="access-status-filter" value={accessStatus} onChange={(e) => setAccessStatus(e.currentTarget.value)}>
                  <option value="granted">Granted</option>
                  <option value="revoked">Revoked</option>
                  <option value="available">Available</option>
                </select>
              </div>
            </div>

            <div id="access-items-container" className="border-muted/50 max-h-50 min-h-50 overflow-y-auto border relative">
              <div className="text-xs grid grid-cols-4 bg-secondary text-white p-2 font-bold *:w-50 sticky top-0 h-max">
                <p>Name</p>
                <p className="items-center flex">
                  Access Level &nbsp; <IconInfoCircle title="The minimum required access level to grant the resource" className="inline size-4" />
                </p>
                <p className="first-letter:uppercase">{accessStatus !== "available" ? accessStatus : "Type"}</p>
                <p>Action</p>
              </div>
              {employee &&
                accessStatus !== "available" &&
                employeeRa.map((ra, index) => {
                  const resource = resourcesById[ra.resourceId];
                  const al = resource ? accessLevelsById[resource.accessLevelId] : undefined;

                  return (
                    <div className="grid grid-cols-4 h-max p-2 border-b border-muted last:border-0" key={index} hidden={(accessStatus === "revoked" && !ra.revoked) || accessLevel !== al?.name.toLowerCase()}>
                      <p>{resource?.name}</p>
                      <p>{al?.name}</p>
                      <p>{new Date(ra.granted).toLocaleDateString()}</p>
                      <button onClick={() => setToRevoke((prevSet) => [...prevSet, ra.id])} className="text-danger hover:underline">
                        <IconMinus title="Revoke" />
                      </button>
                    </div>
                  );
                })}
              {accessStatus === "available" &&
                resources.map((r, index) => {
                  const rc = resourceCategoriesById[r.categoryId].name;
                  const ac = accessLevelsById[r.accessLevelId].name;
                  return (
                    <div className="grid grid-cols-4 h-max p-2 border-b border-muted last:border-0" hidden={accessLevel.toLowerCase() !== ac.toLowerCase()} key={index}>
                      <p>{r.name}</p>
                      <p>{ac}</p>
                      <p>{rc}</p>
                      <button onClick={() => setToGrant((prevSet) => [...prevSet, r.id])} className="text-success hover:underline text-start">
                        Grant
                      </button>
                    </div>
                  );
                })}
            </div>
            <br />
            <div className="flex flex-row items-center justify-end gap-1">
              <input type="radio" name="post-edit-actions" id="clear" value="clear" checked={postEditAction === "clear"} onChange={(e) => setPostEditAction(e.currentTarget.value)} />
              <label htmlFor="clear">Clear</label>

              <input type="radio" name="post-edit-actions" id="review" value="review" checked={postEditAction === "review"} onChange={(e) => setPostEditAction(e.currentTarget.value)} className="ml-4" />
              <label htmlFor="review">Review</label>

              <button className={`ml-4 p-2 bg-success interactive text-white shadow-sm ${!employee ? "contrast-50" : ""}`} onClick={handleProcess} disabled={!employee}>
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
