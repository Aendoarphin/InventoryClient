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
    <footer className="border-t border-muted fixed bottom-0 left-0 right-0 h-max flex justify-between px-4 bg-card">
      <div>
        @ {new Date().getFullYear()} {import.meta.env.VITE_COMPANY_NAME} Inventory Manager
      </div>
      <div>
        <p>API Status: {status}</p>
      </div>
    </footer>
  );
}

export default Footer;
