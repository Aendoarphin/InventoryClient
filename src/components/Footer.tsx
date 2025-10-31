import axios from "axios";
import { useEffect, useState } from "react";

function Footer() {
  const [status, setStatus] = useState("Checking status...");

  useEffect(() => {
    const getAPI = async () => {
      try {
        await axios.get(`https://${import.meta.env.VITE_WEBAPI_HOST}/`);
        setStatus("Connected");
      } catch (error) {
        setStatus("Disconnected");
      }
    };
    getAPI();

    const intervalId = setInterval(getAPI, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <footer className="*:fixed *:bottom-0 *:text-xs *:px-4 *:py-2 *:text-muted">
      <div>
        @ {new Date().getFullYear()} {import.meta.env.VITE_COMPANY_NAME} Inventory Manager
      </div>
      <div className="flex flex-row justify-end gap-2 w-full">
        <p>API Status: {status}</p>
      </div>
    </footer>
  );
}

export default Footer;
