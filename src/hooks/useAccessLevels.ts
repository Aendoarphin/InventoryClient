import { baseApiUrl } from "@/static";
import type { AccessLevel } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useAccessLevels(): { accessLevels: AccessLevel[]; setAccessLevels: React.Dispatch<React.SetStateAction<AccessLevel[]>>; setRefresh: React.Dispatch<React.SetStateAction<boolean>>; } {
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([]);
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    async function fetchAccessLevels() {
      try {
        const res = await axios.get(`${baseApiUrl}/Api/AccessLevel`);
        const accessLevels = res.data;
        setAccessLevels(JSON.parse(JSON.stringify(accessLevels)));
      } catch (error) {
        console.error("Error fetching access levels");
      }
    }
    fetchAccessLevels();
  }, [refresh]);

  return { accessLevels, setAccessLevels, setRefresh };
}

export default useAccessLevels;
