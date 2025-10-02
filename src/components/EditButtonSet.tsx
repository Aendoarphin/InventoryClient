import { modelContextMap } from "@/static";
import axios from "axios";
import { useContext } from "react";

interface IEditButtonSetProps {
  request: { requestType: string, setRequestType: React.Dispatch<React.SetStateAction<string>>}
  tableName: string;
  isSelected: boolean;
  rowId: {
    selectedRowId: number;
    setSelectedRowId: React.Dispatch<React.SetStateAction<number>>;
  };
  form: {
    formIsVisible: boolean;
    setFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

function EditButtonSet({
  request,
  tableName,
  isSelected,
  rowId,
  form,
}: IEditButtonSetProps) {
  const normalizedTableName = tableName.toLowerCase();
  const ContextToUse = modelContextMap[normalizedTableName];

  if (!ContextToUse) {
    throw new Error(`No context found for table: ${tableName}`);
  }

  const modelContext = useContext(ContextToUse);

  const handleAdd = () => {
    request.setRequestType("post")
    form.setFormIsVisible(true)
  }

  const handleEdit = async () => {
    request.setRequestType("put")
    form.setFormIsVisible(true);
    modelContext.setModified(!modelContext.modified);
  };

  const handleDelete = async () => {
    request.setRequestType("delete")
    const { status } = await axios.delete(
      `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
      {
        params: {
          id: rowId.selectedRowId,
        },
        headers: {
          accept: "*/*",
        },
      }
    );
    if (status === 200) {
      modelContext?.setModified(!modelContext.modified);
      rowId.setSelectedRowId(0);
      return;
    }
    alert("error");
  };

  return (
    <div>
      <div className="flex flex-row gap-2 *:p-2 *:text-white text-xs *:shadow-lg *:active:shadow-none *:active:translate-y-0.5">
        <button
          disabled={isSelected}
          className={`bg-success ${isSelected ? "contrast-50" : "contrast-100"}`}
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          disabled={!isSelected}
          className={`bg-info ${!isSelected ? "contrast-50" : "contrast-100"}`}
          onClick={handleEdit}
        >
          Edit
        </button>
        <button
          disabled={!isSelected}
          className={`bg-danger ${!isSelected ? "contrast-50" : "contrast-100"}`}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default EditButtonSet;
