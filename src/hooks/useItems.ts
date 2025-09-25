import axios from "axios"
import { useEffect, useState } from "react"

export interface Item {
  id: number,
  serial: number,
  description: string,
  office: string,
  branch: string
}

function useItems(modified: boolean) {
  const [items, setItems] = useState<Item[]>([])
  async function getItems() {
    try {
      const response = await axios.get(`https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/Item`)
      if (response) {
        return response.data
      }
    } catch (e) {
      console.error("Error")
    }
  }

  useEffect(() => {
    async function fetchData() {
      const items = await getItems();
      setItems(items)
    }
    fetchData();
  }, [modified])
  return items
}

export default useItems