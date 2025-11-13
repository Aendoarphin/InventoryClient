import type { ResourceCategory } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResourceCategories(): { resourceCategories: ResourceCategory[]; setResourceCategories: React.Dispatch<React.SetStateAction<ResourceCategory[]>> } {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);

  useEffect(() => {
    async function fetchResourceCategories() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/ResourceCategory`);
        const resourceCategories = res.data;
        setResourceCategories(JSON.parse(JSON.stringify(resourceCategories)));
      } catch (error) {
        console.error("Error fetching resourceCategories");
      }
    }
    fetchResourceCategories();
  }, []);

  return { resourceCategories, setResourceCategories };
}

export default useResourceCategories;
