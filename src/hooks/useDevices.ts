import { baseApiUrl } from "@/static";
import axios from "axios";
import { useEffect, useState } from "react";

interface Device {
  id: number;
  name: string;
  ipv4: string;
}

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
