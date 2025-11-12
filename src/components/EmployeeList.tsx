import useAccessLevels from "@/hooks/useAccessLevels";
import useEmployees from "@/hooks/useEmployees";
import useResourceAssociations from "@/hooks/useResourceAssociations";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import type { AccessLevel, Employee, Resource, ResourceAssociation, ResourceCategory } from "@/types";
import { IconInfoCircle, IconMinus } from "@tabler/icons-react";
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

  const [employeeType, setEmployeeType] = useState("active");
  const [accessCategoryType, setAccessCategoryType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [employee, setEmployee] = useState<Employee>();
  const [postEditAction, setPostEditAction] = useState("clear");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [refetch, setRefetch] = useState(false);
  const [newAccessPayload, setNewAccessPayload] = useState({});

  const employeeRa: ResourceAssociation[] = useResourceAssociations(employee?.id, refetch);
  const accessLevels: AccessLevel[] = useAccessLevels().accessLevels.filter((al) => al.active);
  const resources = useResources().resources;

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
        newAccessPayload,
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
  };

  const stageAccessChanges = async (resourceAssociationId: number) => {
    try {
      const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/EmployeeResourceAssociation/search?employeeId=${employee?.id}`);
      const newRa = { ...res.data[0], revoked: Date.now() };
      console.log(newRa);
      // const res2 = await axios.put(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/EmployeeResourceAssociation?id=${resourceAssociationId}`, newRa)
      // console.log(res2.data)
    } catch (error: any) {
      console.log("Changes failed to stage: " + error.message);
    } finally {
      console.log("stageAccessChanges() completed with code 67");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="col-span-5 flex flex-row justify-between items-baseline">
        <h2>Employees</h2>
        <div className="flex flex-row gap-2 *:p-2 *:text-white text-xs">
          <button className="bg-success interactive" title="Add a new employee to the system">
            Add
          </button>
          <button disabled={!employee} className={`bg-danger interactive ${!employee ? "contrast-50" : ""}`} title="Permanently remove employee from the system">
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 *:bg-card *:border *:border-muted *:shadow-md *:max-h-[80vh]">
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
            <div className="grid grid-cols-2 gap-4 border-t border-muted pt-2 **:disabled:bg-muted/20 **:disabled:text-muted-foreground">
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
                <strong className="flex items-end gap-2">
                  End Date <IconInfoCircle className="w-4 inline" title="Provide a value to inactivate this employee, otherwise leave blank" />
                </strong>
                <input type="date" value={formData.endDate} onChange={(e) => handleInputChange("endDate", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Job Title</strong>
                <input type="text" value={formData.jobTitle} onChange={(e) => handleInputChange("jobTitle", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
              <div>
                <strong>Created Date</strong>
                <input type="text" value={formData.created.length > 0 ? new Date(formData.created).toLocaleDateString() : ""} disabled className="w-full mt-1 p-1 border border-muted bg-muted/20 text-muted-foreground" />
              </div>
              <div>
                <strong>Branch</strong>
                <input type="text" value={formData.branch} onChange={(e) => handleInputChange("branch", e.target.value)} disabled={!employee} className="w-full mt-1 p-1 border border-muted" />
              </div>
            </div>
            <br />
            <div className="flex flex-row justify-between items-baseline">
              <h5>Access Management</h5>
              <div className="text-xs">
                <label htmlFor="resource-category-filter">Category: </label>
                <select className="border border-muted" name="resource-category-filter" id="resource-category-filter" value={accessCategoryType} onChange={(e) => setAccessCategoryType(e.currentTarget.value)}>
                  <option value={"all"}>All</option>
                  {useResourceCategories()[0]
                    .filter((e) => e.active === 1)
                    .map((rc: ResourceCategory, i) => (
                      <option key={i} value={rc.name.toLowerCase()}>
                        {rc.name}
                      </option>
                    ))}
                </select>
                &nbsp;&nbsp;
                <label htmlFor="access-level-filter">Access Level: </label>
                <select className="border border-muted" name="access-level-filter" id="access-level-filter" value={accessCategoryType} onChange={(e) => setAccessCategoryType(e.currentTarget.value)}>
                  {accessLevels.map((rc: ResourceCategory, i) => (
                    <option key={i} value={rc.name.toLowerCase()}>
                      {rc.name}
                    </option>
                  ))}
                </select>
                &nbsp;&nbsp;
                <label htmlFor="access-level-filter">Status: </label>
                <select className="border border-muted" name="access-level-filter" id="access-level-filter" value={accessCategoryType} onChange={(e) => setAccessCategoryType(e.currentTarget.value)}>
                  <option value="granted">Granted</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
            </div>
            <div className="text-xs grid grid-cols-4 bg-secondary text-white p-2 *:last:ml-auto">
              <p>Name</p>
              <p>Access Level (Upper Bound)</p>
              <p>Granted</p>
              <p>Action</p>
            </div>
            <div className="border-muted/50 min-h-[200px] overflow-y-auto border grid *:hover:bg-muted/25 *:h-max *:border-b *:last-of-type:border-none *:border-muted *:p-2">
              {employee &&
                employeeRa.map((ra, index) => (
                  <div className="grid grid-cols-4 *:last:ml-auto text-sm" key={index}>
                    <p>{resources.find(r => r.id === ra.resourceId)?.name}</p>
                    <p>{resources.find(r => r.id === ra.resourceId)?.id}</p>
                    <p>{resources.find(r => r.id === ra.resourceId)?.id}</p>
                    <p>Action Button</p>
                  </div>
                ))}
              {/* Output resource associations for employee */}
            </div>
            <br />
            <div className="flex flex-row items-center justify-end text-sm gap-1">
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
