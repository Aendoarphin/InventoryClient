import { modelContextMap } from "@/static";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

function TableRecordForm({
  requestType,
  tableName,
  tableColumns,
  form,
  rowId: { selectedRowId, setSelectedRowId },
}: {
  requestType: string;
  tableName: string;
  tableColumns: string[];
  form: {
    formIsVisible: boolean;
    setFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
  rowId: {
    selectedRowId: number;
    setSelectedRowId: React.Dispatch<React.SetStateAction<number>>;
  };
}) {
  const normalizedTableName = tableName.toLowerCase();
  const contextToUse = modelContextMap[normalizedTableName];
  const modelContext = useContext(contextToUse);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    async function getTargetRecord() {
      if (selectedRowId !== 0) {
        const targetRecord = await axios.get(
          `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}/${selectedRowId?.toString()}`
        );
        setFormData(targetRecord.data);
      } else {
        setFormData({});
      }
    }
    getTargetRecord();
  }, [selectedRowId, tableName]);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();

      let res;
      if (form.formIsVisible) {
        if (requestType === "put") {
          res = await axios.put(
            `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
            formData,
            {
              params: {
                id: selectedRowId,
              },
            }
          );
          if (res.status !== 204) {
            window.alert(res.status);
          }
        } else if (requestType === "post") {
          res = await axios.post(
            `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
            formData
          );
          if (res.status !== 201) {
            console.error(res.status);
          }
        }
        form.setFormIsVisible(false);
        modelContext?.setModified(!modelContext.modified);
      }
    } catch (error: any) {
      if (error.status === 500) {
        alert("Unexpected error has occured");
      } else alert(error);
    }
  }

  function handleCancel() {
    setFormData({});
    form.setFormIsVisible(false);
    setSelectedRowId(0);
  }

  useEffect(() => {
    console.log(selectedRowId)
  }, [selectedRowId])

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement>,
    column: string
  ) {
    setFormData({ ...formData, [column]: e.target.value });
  }

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 backdrop-brightness-25 bg-transparent z-40">
      <form
        className="flex flex-col size-8/12 place-self-center bg-card p-6 gap-4 overflow-y-scroll"
        onSubmit={(e) => handleFormSubmit(e)}
      >
        <strong>Enter {tableName} Information</strong>
        {tableColumns.map((column, index) => (
          <div key={index} className="**:w-full">
            <label htmlFor={column} className="uppercase font-bold">
              {column}{" "}
              {column.toLowerCase() === "id" && (
                <span className="text-danger">*</span>
              )}
            </label>
            <input
              maxLength={column.toLowerCase() === "id" ? 9 : undefined}
              required={column.toLowerCase() === "id"}
              id={column}
              name={column}
              defaultValue={column.toLowerCase().includes("date", 0) ? Date.now() : ""}
              type={
                column.toLowerCase().includes("date", 0)
                  ? "datetime-local"
                  : "text"
              }
              className="border border-muted px-2"
              onChange={(e) => handleOnChange(e, column)}
              value={formData[column] || ""}
            />
          </div>
        ))}
        <div className="w-full mx-auto text-white *:p-2 *:w-full flex flex-row gap-2 max-w-4xl *:shadow-md">
          <button className="bg-danger" type="button" onClick={handleCancel}>
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

export default TableRecordForm;
