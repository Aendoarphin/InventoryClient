import { baseApiUrl } from '@/static';
import axios from 'axios';
import { useEffect, useState } from 'react'

function useMetrics() {
  const [metrics, setMetrics] = useState<Record<string, any>[]>([])

  useEffect(() => {
    async function fetchMetrics() {
      const itemMetrics = await axios.get(`${baseApiUrl}/api/Item/metrics`)
      const vendorMetrics = await axios.get(`${baseApiUrl}/api/Vendor/metrics`)
      setMetrics([itemMetrics.data, vendorMetrics.data])
    }
    fetchMetrics();
  }, []);

  return metrics
}

export default useMetrics