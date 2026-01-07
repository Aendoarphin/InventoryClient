import { baseApiUrl } from "@/static";
import type { Device } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";

function useDevices() {
  const [devices, setDevices] = useState<Device[]>();
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    async function getDevices() {
      try {
        const response = await axios.get(`${baseApiUrl}/Api/Device`)
        setDevices(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    getDevices();
  }, [refetch]);

  return { devices, setDevices, setRefetch };
}

export default useDevices;
