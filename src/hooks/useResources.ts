import { baseApiUrl } from "@/static";
import type { Resource } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResources(): { resources: Resource[]; setResources: React.Dispatch<React.SetStateAction<Resource[]>>; setRefresh: React.Dispatch<React.SetStateAction<boolean>> } {
  const [resources, setResources] = useState<Resource[]>([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await axios.get(`${baseApiUrl}/Api/Resource`);
        const resources = res.data;
        setResources(JSON.parse(JSON.stringify(resources)));
      } catch (error) {
        console.error("Error fetching resources");
      }
    }
    fetchResources();
  }, [refresh]);

  return { resources, setResources, setRefresh };
}

export default useResources;
