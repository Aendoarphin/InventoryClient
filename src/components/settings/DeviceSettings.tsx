import useDevices from "@/hooks/useDevices";
import { useState } from "react";

function DeviceSettings() {
  const { devices, setRefetch } = useDevices();
  const [deviceName, setDeviceName] = useState("");
  const [address, setAddress] = useState("");

  function isValid() {
    const ipv4 =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const regexRes = ipv4.test(address);
    return regexRes && deviceName.length > 0;
  }

  return (
    <>
      <div className="inline-flex items-center w-full justify-between">
        <div>
          <h6>Devices</h6>
          <p className="text-muted">Add IPV4s to monitor devices</p>
        </div>
        <div className="inline-flex items-center border border-muted h-max">
          <input
            type="text"
            name="device-name"
            id="device-name"
            placeholder="Enter device name"
            className="px-2 outline-0"
            value={deviceName}
            onChange={(e) => setDeviceName(e.currentTarget.value)}
            maxLength={100}
          />
          <input
            type="text"
            name="ipv4"
            id="ipv4"
            placeholder="Enter IPv4 Address"
            className="px-2 outline-0 border-l border-muted"
            value={address}
            onChange={(e) => setAddress(e.currentTarget.value)}
            maxLength={15}
          />
          <input
            type="button"
            value="+ Add"
            className="bg-success px-2 py-1 text-white active:contrast-50 disabled:contrast-50"
            disabled={!isValid()}
            onClick={() => window.alert(address)}
          />
        </div>
      </div>
      <hr className="text-muted my-4" />
      <div className="grid grid-cols-3 gap-2">
        { devices && devices.length > 0 ? <div className="bg-primary p-2 inline-flex justify-between"><span>Name</span><span>IP</span></div> : <p className="text-muted">Device List Empty</p>}
      </div>
    </>
  );
}

export default DeviceSettings;
