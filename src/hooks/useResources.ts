import type { Resource } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useResources(): Resource[] {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/Resource`);
        const resources = res.data;
        setResources(JSON.parse(JSON.stringify(resources)));
      } catch (error) {
        console.error("Error fetching resources");
      }
    }
    fetchResources();
  }, []);

  return resources;
}

export default useResources;
