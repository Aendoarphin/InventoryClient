import { baseApiUrl } from "@/static";
import axios from "axios";
import { useEffect, useState } from "react";

export interface Item {
  id: number;
  serial: number;
  description: string;
  office: string;
  branch: string;
}

function useItems(modified: boolean, searchValues: string) {
  const [items, setItems] = useState<Item[]>([]);
  async function getItems() {
    try {
      let response;
      const getAll = `${baseApiUrl}/api/Item`;
      const getSearched = `${baseApiUrl}/api/Item/search`;

      if (searchValues.length > 0) {
        response = await axios.get(
          getSearched,
          { params: { keyword: searchValues } }
        );
      } else {
        response = await axios.get(getAll)
      }

      if (response) {
        return response.data;
      }
    } catch (e) {
      console.error("Error");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const items = await getItems();
      setItems(items);
    }
    fetchData();
  }, [modified, searchValues]);
  return items;
}

export default useItems;
