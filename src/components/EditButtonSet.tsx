import { ItemContext } from "@/routes/manage.Item";
import axios from "axios";
import { useContext } from "react";

interface IEditButtonSetProps {
  tableName: string;
  isSelected: boolean;
}

function EditButtonSet({ tableName, isSelected }: IEditButtonSetProps) {
  const itemContext = useContext(ItemContext);
  console.log(itemContext?.modified);
  const handleAdd = async () => {
    await axios.post(
      `https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/${tableName}`,
      {
        id: 2252,
        serial: "string",
        description: "string",
        branch: "string",
        office: "string",
        comments: "string",
        purchaseDate: "2025-09-25T19:19:21.771Z",
        replacementCost: 0,
      }
    );
    itemContext?.setModified(!itemContext.modified);
    alert(itemContext?.modified);
  };

  const handleEdit = () => {
    alert("edited");
  };

  const handleDelete = () => {
    alert("deleted");
  };

  return (
    <div className="border border-muted border-b-0 p-4 place-items-center">
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
