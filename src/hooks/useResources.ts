import { baseApiUrl } from "@/static";
import type { Resource } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResources(): { resources: Resource[]; setResources: React.Dispatch<React.SetStateAction<Resource[]>> } {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await axios.get(`${baseApiUrl}/api/Resource`);
        const resources = res.data;
        setResources(JSON.parse(JSON.stringify(resources)));
      } catch (error) {
        console.error("Error fetching resources");
      }
    }
    fetchResources();
  }, []);

  return { resources, setResources };
}

export default useResources;
