import axios from "axios";
import { useEffect, useState } from "react";

function useAccessLevels() {
  const [accessLevels, setAccessLevels] = useState([]);

  useEffect(() => {
    async function fetchAccessLevels() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/AccessLevel`);
        const accessLevels = res.data;
        setAccessLevels(JSON.parse(JSON.stringify(accessLevels)));
      } catch (error) { console.error("Error fetching access levels") }
    }
    fetchAccessLevels();
  }, []);

  return accessLevels;
}

export default useAccessLevels;
