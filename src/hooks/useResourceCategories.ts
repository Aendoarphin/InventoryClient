import axios from "axios";
import { useEffect, useState } from "react";

function useResourceCategories() {
  const [resourceCategories, setResourceCategories] = useState([]);

  useEffect(() => {
    async function fetchResourceCategories() {
      try {
        const res = await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/api/ResourceCategory`);
        const resourceCategories = res.data;
        setResourceCategories(JSON.parse(JSON.stringify(resourceCategories)));
      } catch (error) { console.error("Error fetching resourceCategories") }
    }
    fetchResourceCategories();
  }, []);

  return resourceCategories;
}

export default useResourceCategories;
