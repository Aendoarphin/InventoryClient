import { baseApiUrl } from "@/static";
import type { AccessLevel } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useAccessLevels(): { accessLevels: AccessLevel[]; setAccessLevels: React.Dispatch<React.SetStateAction<AccessLevel[]>> } {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);

  useEffect(() => {
    async function fetchAccessLevels() {
      try {
        const res = await axios.get(`${baseApiUrl}/api/AccessLevel`);
        const accessLevels = res.data;
        setAccessLevels(JSON.parse(JSON.stringify(accessLevels)));
      } catch (error) {
        console.error("Error fetching access levels");
      }
    }
    fetchAccessLevels();
  }, [accessLevels]);

  return { accessLevels, setAccessLevels };
}

export default useAccessLevels;
