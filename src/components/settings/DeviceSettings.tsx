import useDevices from "@/hooks/useDevices";
import { baseApiUrl } from "@/static";
import axios from "axios";
import { useState } from "react";

function DeviceSettings() {
  const { devices, setRefetch } = useDevices();
  const [toSubmit, setToSubmit] = useState<{ name: string; ip: string }>({ name: "", ip: "" });

  function isValid() {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const regexRes = ipv4.test(toSubmit.ip);
    return regexRes && toSubmit.name.length > 0;
  }

  async function registerDevice() {
    try {
      const response = await axios.get(`${baseApiUrl}/Api/Network/ping/${toSubmit.ip}`);
      if (response.data && devices?.filter((e) => e.ipv4 === toSubmit.ip).length === 0) {
        await axios.post(`${baseApiUrl}/Api/Device`, { id: 0, name: toSubmit.name, ipv4: toSubmit.ip });
        window.alert("The result was " + response.data);
        setRefetch((prev) => !prev);
      } else {
        window.alert(toSubmit.ip + " could not be added");
      }
      setToSubmit({ name: "", ip: "" });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="inline-flex items-center w-full justify-between">
        <div>
          <h6>Devices</h6>
          <p className="text-muted">Add IPv4 addressess to monitor connectivity of devices</p>
        </div>
        <div className="inline-flex items-center border border-muted h-max">
          <input type="text" name="device-name" id="device-name" placeholder="Enter device name" className="px-2 outline-0" value={toSubmit.name} onChange={(e) => setToSubmit({ ...toSubmit, name: e.currentTarget.value })} maxLength={100} />
          <input type="text" name="ipv4" id="ipv4" placeholder="Enter IPv4 Address" className="px-2 outline-0 border-l border-muted" value={toSubmit.ip} onChange={(e) => setToSubmit({ ...toSubmit, ip: e.currentTarget.value })} maxLength={15} />
          <input type="button" value="+ Add" className="bg-success px-2 py-1 text-white active:contrast-50 disabled:contrast-50" disabled={!isValid()} onClick={registerDevice} />
        </div>
      </div>
      <hr className="text-muted my-4" />
      <div className="grid grid-cols-3 gap-2">
        {devices && devices.length > 0 ? (
          <div className="bg-primary p-2 inline-flex justify-between">
            {devices.map((e) => (
              <div>
                {e.name} | {e.ipv4}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">Device List Empty</p>
        )}
      </div>
    </>
  );
}

export default DeviceSettings;
