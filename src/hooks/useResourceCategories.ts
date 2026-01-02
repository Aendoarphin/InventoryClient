import { baseApiUrl } from "@/static";
import type { ResourceCategory } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResourceCategories(): { resourceCategories: ResourceCategory[]; setResourceCategories: React.Dispatch<React.SetStateAction<ResourceCategory[]>>; setRefresh: React.Dispatch<React.SetStateAction<boolean>>; } {
  const [resourceCategories, setResourceCategories] = useState<ResourceCategory[]>([]);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function fetchResourceCategories() {
      try {
        const res = await axios.get(`${baseApiUrl}/Api/ResourceCategory`);
        const resourceCategories = res.data;
        setResourceCategories(JSON.parse(JSON.stringify(resourceCategories)));
      } catch (error) {
        console.error("Error fetching resourceCategories");
      }
    }
    fetchResourceCategories();
  }, [refresh]);

  return { resourceCategories, setResourceCategories, setRefresh };
}

export default useResourceCategories;
