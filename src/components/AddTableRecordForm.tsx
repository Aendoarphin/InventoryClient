import { useState } from "react";

function AddTableRecordForm({ tableName }: { tableName: string }) {
  const [formData, setFormData] = useState({
    id: 0,
    serial: "",
    description: "",
    branch: "", // continue here
    office: "",
    comments: "",
    purchaseDate: "",
    replacementCost: 0,
  });
  return (
    <div>
      <form
        action={`https://${import.meta.env.VITE_WEBAPI_IP}:7079/${tableName}`}
        method="post"
      >
        <input type="text" required />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default AddTableRecordForm;
