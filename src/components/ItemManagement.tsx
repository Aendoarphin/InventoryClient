import axios from "axios";
import InventoryTable from "./InventoryTable";

function ItemManagement() {
  async function getItems() {
    const response = await axios.get(`https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/Item`)
    return response.data
  }
  const items = getItems()

  console.log(typeof items)

  return (
    <div>
      <InventoryTable />
    </div>
  );
}

export default ItemManagement;
