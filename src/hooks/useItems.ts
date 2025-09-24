import axios from "axios"
import { useEffect, useState } from "react"

export interface Item {
  id: number,
  serial: number,
  description: string,
  office: string,
  branch: string
}

function useItems() {
  const [items, setItems] = useState<Item[]>([])
  async function getItems() {
    try {
      console.log("Fulfilling promise")
      const response = await axios.get(`https://${import.meta.env.VITE_WEBAPI_IP}:7097/api/Item`)
      if (response) {
        console.log("Promise fulfilled: " + JSON.stringify(response.data))
        return response.data
      }
    } catch (e) {
      console.error("Error fulfilling promise")
    }
  }

  useEffect(() => {
    async function fetchData() {
      const items = await getItems();
      setItems(items)
    }
    fetchData();
  }, [])
  return items
}

export default useItems