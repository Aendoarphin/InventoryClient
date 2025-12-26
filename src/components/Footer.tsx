import { baseApiUrl, versionNumber } from "@/static";
import axios from "axios";
import { useEffect, useState } from "react";

function Footer() {
  const [status, setStatus] = useState("Checking status...");

  useEffect(() => {
    const getAPI = async () => {
      try {
        await axios.get(`${baseApiUrl}/`);
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
    <footer className="border-t border-muted fixed bottom-0 left-0 right-0 h-max flex justify-between px-4 bg-card text-muted">
      <div>
        <p>@ {new Date().getFullYear()} {import.meta.env.VITE_COMPANY_NAME} Inventory Manager</p>
      </div>
      <div className="inline-flex gap-2">
        <p>Version: {versionNumber}</p>
        |
        <p>API Status: {status}</p>
      </div>
    </footer>
  );
}

export default Footer;
