import useAccessLevels from "@/hooks/useAccessLevels";
import useTimedError from "@/hooks/useTimedError";
import { baseApiUrl } from "@/static";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

function AccessLevelSettings() {
  const { accessLevels, setRefresh } = useAccessLevels();
  const { error, setTimedError } = useTimedError(5000);
  const [accessInput, setAccessInput] = useState<string | undefined>(undefined);

  const submitAccessLevel = async (accessInput: string) => {
    if (accessInput.length <= 0) return;
    try {
      const existingItem = accessLevels.find(
        (e) => e.name.toLowerCase() === accessInput.toLowerCase()
      );
      if (existingItem) {
        await axios.put(baseApiUrl + `/Api/AccessLevel?id=${existingItem.id}`, {
          id: existingItem.id,
          name: existingItem.name,
          active: 1,
        });
      } else {
        await axios.post(`${baseApiUrl}/Api/AccessLevel`, {
          id: 0,
          name: accessInput.toLowerCase(),
          active: 1,
        });
      }
    } catch (e) {
      setTimedError("Could not perform action")
    }
    setRefresh((prev) => !prev);
    setAccessInput("");
  };

  const removeAccesslevel = async (id: number, payload: object) => {
    try {
      const response = await axios.put(
        `${baseApiUrl}/Api/AccessLevel?id=${id.toString()}`,
        payload
      );
      if (response.status >= 300)
        setTimedError(response.statusText);
    } catch (e) {
      setTimedError("Could not perform action");
    }
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <div className="inline-flex justify-between w-full items-center">
        <div>
          <h6>Access Levels</h6>
          <p className="text-muted">
            Add or delete access levels which can be used to tag a resource.
          </p>
        </div>
        <div className="inline-flex mr-2">
          {error && (
            <p id="error-message-container" className="text-danger ml-4">
              {error}
            </p>
          )}
        </div>
        <div className="inline-flex items-center border border-muted h-max">
          <input
            type="text"
            name="access-level-name"
            id="access-level-name"
            placeholder="Enter access level name"
            className="px-2 outline-0"
            onChange={(e) => setAccessInput(e.currentTarget.value)}
            value={accessInput}
          />
          <input
            type="button"
            value="+ Add"
            className="bg-success px-2 py-1 text-white active:contrast-50 disabled:contrast-25"
            disabled={!accessInput || accessInput.length <= 0}
            onClick={() => submitAccessLevel(accessInput || "")}
          />
        </div>
      </div>
      <hr className="text-muted my-4" />
      <div
        id="access-list-container"
        className="flex flex-wrap gap-2 mt-4 *:uppercase"
      >
        {accessLevels
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (e, i) =>
              e.active === 1 && (
                <div
                  key={i}
                  className="p-2 bg-primary/20 border border-primary rounded-md inline-flex text-xs items-center"
                >
                  {e.name}&nbsp;&nbsp;
                  <IconTrash
                    className="cursor-pointer px-1 text-danger"
                    onClick={() =>
                      removeAccesslevel(e.id, {
                        id: e.id,
                        name: e.name,
                        active: 0,
                      })
                    }
                  />
                </div>
              )
          )}
      </div>
    </>
  );
}

export default AccessLevelSettings;
