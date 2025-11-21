import { useState } from "react";
import { EMPTY_FORM, type FormData } from "./EmployeeList";
import axios from "axios";
import { baseApiUrl } from "@/static";

function NewEmployeeForm({ setVisible, employees }: { setVisible: React.Dispatch<React.SetStateAction<boolean>>; employees: { refetch: boolean; setRefetch: React.Dispatch<React.SetStateAction<boolean>> } }) {
  const [formData, setFormData] = useState(EMPTY_FORM);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === "startDate" || field === "endDate") {
      const isoDateStr = new Date(value).toISOString();
      setFormData((prev) => ({ ...prev, [field]: isoDateStr }));
      console.log(isoDateStr);
    }

    if (field === "endDate" || value.length === 0) {
      setFormData((prev) => ({ ...prev, [field]: null }));
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      let endDate: string | null = formData.endDate.length > 0 ? new Date(formData.endDate).toISOString() : null;
      let startDate: string = formData.startDate.length > 0 ? new Date(formData.startDate).toISOString() : new Date().toISOString();
      const created = new Date().toISOString();

      await axios.post(baseApiUrl + `/api/Employee`, {
        id: 0,
        ...formData,
        startDate,
        endDate,
        created,
      });

      setFormData(EMPTY_FORM);
      setVisible(false);
      employees.setRefetch(!employees.refetch);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-black/40 *:mx-auto place-content-center backdrop-blur-sm">
      <form id="newEmployeeForm" className="bg-card border border-muted w-max max-w-xl min-w-sm flex flex-col gap-2 p-4 [&_label]:font-bold [&_input]:border [&_input]:border-muted [&_input]:px-2" onSubmit={(e) => handleFormSubmit(e)}>
        <label htmlFor="first">First</label>
        <input required id="first" type="text" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("first", e.target.value)} />
        <label htmlFor="last">Last</label>
        <input required id="last" type="text" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("last", e.target.value)} />
        <label htmlFor="branch">Branch</label>
        <input required id="branch" type="text" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("branch", e.target.value)} />
        <label htmlFor="jobTitle">Job Title</label>
        <input required id="jobTitle" type="text" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("jobTitle", e.target.value)} />
        <label htmlFor="startDate">Start Date</label>
        <input id="startDate" type="date" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("startDate", e.target.value)} />
        <label htmlFor="endDate">End Date</label>
        <input id="endDate" type="date" form="newEmployeeForm" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("endDate", e.target.value)} />
        <br />
        <div className="flex flex-row gap-2 w-full *:w-full">
          <input
            type="button"
            onClick={() => {
              setVisible(false);
              setFormData(EMPTY_FORM);
            }}
            value="Cancel"
            className="bg-danger text-white interactive"
          />
          <input type="submit" value="Submit" className="bg-success text-white interactive" />
        </div>
      </form>
    </div>
  );
}

export default NewEmployeeForm;
