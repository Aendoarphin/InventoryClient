import axios from 'axios';
import React, { useEffect, useState } from 'react'

function useMetrics() {
  const [metrics, setMetrics] = useState<Record<string, any>[]>([])

  useEffect(() => {
    async function fetchMetrics() {
      const itemMetrics = await axios.get(`https://${import.meta.env.VITE_WEBAPI_IP}/api/Item/metrics`)
      console.log(itemMetrics);
      const vendorMetrics = await axios.get(`https://${import.meta.env.VITE_WEBAPI_IP}/api/Vendor/metrics`)
      console.log(vendorMetrics);
      setMetrics([itemMetrics.data, vendorMetrics.data])
    }
    fetchMetrics();
  }, []);

  return metrics
}

export default useMetrics