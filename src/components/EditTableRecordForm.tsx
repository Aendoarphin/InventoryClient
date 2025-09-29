import { ItemContext } from "@/routes/manage.Item";
import axios from "axios";
import { useContext, useState } from "react";

function EditTableRecordForm({
  tableName,
  tableColumns,
  form,
}: {
  tableName: string;
  tableColumns: string[];
  form: {
    formIsVisible: boolean;
    setFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) {
  const itemContext = useContext(ItemContext);
  const [formData, setFormData] = useState<Record<string, any>>({});

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.formIsVisible) {
      const res = await axios.post(
        `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
        formData
      );
      if (res.status !== 201) {
        window.alert(res.status)
      }
    form.setFormIsVisible(false);
    itemContext?.setModified(!itemContext.modified);
    }
  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-brightness-25 bg-transparent z-40">
      <form
        
        action={`https://${import.meta.env.VITE_WEBAPI_IP}:7079/${tableName}`}
        method="post"
        className="flex flex-col size-8/12 place-self-center bg-card p-6 gap-4 overflow-y-scroll"
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <strong>Add New {tableName}</strong>
        {tableColumns.map((column, index) => (
          <>
            <label htmlFor={column} className="uppercase font-bold" key={index}>
              {column}{" "}
              {column.toLowerCase() === "id" && <span className="text-danger">*</span>}
            </label>
            <input
              maxLength={column.toLowerCase() === "id" ? 9 : undefined}
              required={column.toLowerCase() === "id"}
              id={column}
              name={column}
              type={column.toLowerCase().includes("date", 0) ? "date" : "text"}
              className="border border-muted px-2"
              onChange={(e) => setFormData({ ...formData, [column]: e.target.value })}
            />
          </>
        ))}
        <div className="w-full mx-auto text-white *:p-2 *:w-full flex flex-row gap-2 max-w-4xl shadow-md">
          <button
            className="bg-danger"
            type="button"
            onClick={() => form.setFormIsVisible(false)}
          >
            Cancel
          </button>
          <button className="bg-success" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTableRecordForm;
