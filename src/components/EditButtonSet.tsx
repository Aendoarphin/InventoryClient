import { ItemContext } from "@/routes/manage.Item";
import axios from "axios";
import { useContext } from "react";

interface IEditButtonSetProps {
  tableName: string;
  isSelected: boolean;
  selectedRowId: number;
}

function EditButtonSet({
  tableName,
  isSelected,
  selectedRowId,
}: IEditButtonSetProps) {
  const itemContext = useContext(ItemContext);

  const handleAdd = async () => { // Implement POST form
    // await axios.post(
    //   `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
    //   {
    //     id: 2252,
    //     serial: "string",
    //     description: "string",
    //     branch: "string",
    //     office: "string",
    //     comments: "string",
    //     purchaseDate: "2025-09-25T19:19:21.771Z",
    //     replacementCost: 0,
    //   }
    // );
    itemContext?.setModified(!itemContext.modified);
  };

  const handleEdit = () => {
    alert("edited");
  };

  const handleDelete = async () => {
    const { status } = await axios.delete(
      `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
      {
        params: {
          id: selectedRowId,
        },
        headers: {
          accept: "*/*",
        },
      }
    );
    if (status === 200) {
      alert(selectedRowId);
      itemContext?.setModified(!itemContext.modified);
      return
    }
    alert('error')
  };

  return (
    <div className="place-items-center">
      <div className="flex flex-row gap-2 *:p-2 *:text-white text-xs *:rounded-sm *:shadow-lg">
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
