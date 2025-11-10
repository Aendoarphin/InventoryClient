import type { AccessLevel } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useAccessLevels(): AccessLevel[] {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);

  useEffect(() => {
    async function fetchAccessLevels() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/AccessLevel`);
        const accessLevels = res.data;
        setAccessLevels(JSON.parse(JSON.stringify(accessLevels)));
      } catch (error) {
        console.error("Error fetching access levels");
      }
    }
    fetchAccessLevels();
  }, []);

  return accessLevels;
}

export default useAccessLevels;
