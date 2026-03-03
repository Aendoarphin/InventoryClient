import useDevices from "@/hooks/useDevices";
import { baseApiUrl } from "@/static";
import { IconLayoutGrid, IconList, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-react";
import type { Device } from "@/types";
import axios from "axios";
import { useState, useMemo } from "react";

type ViewMode = "grid" | "list";
type SortOrder = "asc" | "desc";

function DeviceSettings() {
  const { devices, setRefetch } = useDevices();
  const [toSubmit, setToSubmit] = useState<{ name: string; ip: string }>({ name: "", ip: "" });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  function isValid() {
    const ipv4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
    const regexRes = ipv4.test(toSubmit.ip);
    return regexRes && toSubmit.name.length > 0;
  }

  async function registerDevice() {
    try {
      const response = await axios.get(`${baseApiUrl}/Api/Network/ping/${toSubmit.ip}`);
      if (devices && devices.filter((e) => e.name === toSubmit.name || e.ipv4 === toSubmit.ip).length > 0) {
        window.alert("Device already registered.");
        return;
      }
      if (response.data && devices?.filter((e) => e.ipv4 === toSubmit.ip).length === 0) {
        const postRes = await axios.post(`${baseApiUrl}/Api/Device`, { id: 0, name: toSubmit.name.toLowerCase(), ipv4: toSubmit.ip });
        postRes.status === 200 && window.alert(`${toSubmit.ip} has been registered.`);
        setRefetch((prev) => !prev);
      } else {
        window.alert("Could not register " + toSubmit.ip + ". Host unreachable.");
      }
      setToSubmit({ name: "", ip: "" });
    } catch (error) {
      console.error(error);
    }
  }

  async function removeSelected() {
    const toDelete = devices?.filter((e) => selectedIds.includes(e.id)) ?? [];
    try {
      await Promise.all(
        toDelete.map((device: Device) =>
          axios.delete(`${baseApiUrl}/Api/Device?id=${device.id}`)
        )
      );
    } catch (error) {
      window.alert("Could not delete one or more devices.");
    }
    setSelectedIds([]);
    setRefetch((prev) => !prev);
  }

  const filteredAndSorted = useMemo(() => {
    return (devices ?? [])
      .filter((e) =>
        searchQuery.trim() === ""
          ? true
          : e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.ipv4.includes(searchQuery)
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [devices, searchQuery, sortOrder]);

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

      {/* Toolbar */}
      <div className="inline-flex items-center gap-2 w-full mb-4">
        <div className="inline-flex items-center border border-muted h-max flex-1 max-w-xs">
          <span className="px-2 text-muted">
            <IconSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search devices..."
            className="px-1 py-1 outline-0 w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        <button
          className="border border-muted p-1 active:contrast-75"
          title={sortOrder === "asc" ? "Sort descending" : "Sort ascending"}
          onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
        >
          {sortOrder === "asc" ? (
            <IconSortAscendingLetters size={18} />
          ) : (
            <IconSortDescendingLetters size={18} />
          )}
        </button>
        <button
          className={`border border-muted p-1 active:contrast-75 ${viewMode === "grid" ? "bg-muted text-white" : ""}`}
          title="Grid view"
          onClick={() => setViewMode("grid")}
        >
          <IconLayoutGrid size={18} />
        </button>
        <button
          className={`border border-muted p-1 active:contrast-75 ${viewMode === "list" ? "bg-muted text-white" : ""}`}
          title="List view"
          onClick={() => setViewMode("list")}
        >
          <IconList size={18} />
        </button>
      </div>

      {/* Items */}
      {filteredAndSorted.length === 0 ? (
        <p className="text-muted text-sm">
          {(devices ?? []).length === 0 ? "Device List Empty" : "No devices match your search."}
        </p>
      ) : viewMode === "grid" ? (
        <div className="flex flex-wrap gap-2">
          {filteredAndSorted.map((e, i) => (
            <label
              key={i}
              className={`item-chips cursor-pointer select-none inline-flex items-center gap-2 ${
                selectedIds.includes(e.id) ? "ring-2 ring-danger opacity-75" : ""
              }`}
            >
              <input
                type="checkbox"
                className="accent-danger"
                checked={selectedIds.includes(e.id)}
                onChange={() => toggleSelected(e.id)}
              />
              <strong className="uppercase">{e.name}</strong>&nbsp;({e.ipv4})
            </label>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {filteredAndSorted.map((e, i) => (
            <label
              key={i}
              className={`cursor-pointer select-none inline-flex items-center gap-3 px-3 py-2 border border-muted text-sm ${
                selectedIds.includes(e.id) ? "ring-2 ring-danger opacity-75 bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="accent-danger"
                checked={selectedIds.includes(e.id)}
                onChange={() => toggleSelected(e.id)}
              />
              <strong className="uppercase">{e.name}</strong>
              <span className="text-muted">{e.ipv4}</span>
            </label>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 py-4 bg-white border-t border-muted shadow-lg z-50">
          <button
            className="bg-danger px-4 py-2 text-white active:contrast-75"
            onClick={removeSelected}
          >
            Delete ({selectedIds.length})
          </button>
          <button
            className="bg-muted px-4 py-2 text-white active:contrast-75"
            onClick={() => setSelectedIds([])}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

export default DeviceSettings;
