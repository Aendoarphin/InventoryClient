import useEmployees from "@/hooks/useEmployees";

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
  const columns = Object.keys({ ...employeeList[0] });

  return (
    <div className="p-8 bg-card shadow-md min-h-9/12">
      <table className="border border-muted overflow-y-scroll">
        <thead className="text-left sticky top-0 bg-thead">
          <tr>
            {columns.map((name) => (
              <th className="p-3 pr-30 first-letter:uppercase text-nowrap" key={name}>
                {name.replace(/(?<!^)([A-Z])/g, " $1")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="overflow-clip border border-danger">
          {employeeList.map((e, index) => (
            <tr className=" *:p-3" key={index}>
              <td>{e.id}</td>
              <td>{e.first}</td>
              <td>{e.last}</td>
              <td>{e.branch}</td>
              <td>{e.jobTitle}</td>
              <td>{e.startDate}</td>
              <td>{e.endDate}</td>
              <td>{e.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
