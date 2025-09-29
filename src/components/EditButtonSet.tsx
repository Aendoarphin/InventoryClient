import { ItemContext } from "@/routes/manage.Item";
import axios from "axios";
import { useContext } from "react";

interface IEditButtonSetProps {
  tableName: string;
  isSelected: boolean;
  selectedRowId: number;
  form: {
    formIsVisible: boolean;
    setFormIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

function EditButtonSet({
  tableName,
  isSelected,
  selectedRowId,
  form,
}: IEditButtonSetProps) {
  const itemContext = useContext(ItemContext);

  const handleEdit = async () => {
    form.setFormIsVisible(true);
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
      itemContext?.setModified(!itemContext.modified);
      return;
    }
    alert("error");
  };

  return (
    <div className="place-items-center">
      <div className="flex flex-row gap-2 *:p-2 *:text-white text-xs *:shadow-lg *:active:shadow-none *:active:translate-y-0.5">
        <button
          disabled={isSelected}
          className={`bg-success ${isSelected ? "contrast-50" : "contrast-100"}`}
          onClick={() => form.setFormIsVisible(true)}
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
