import useAccessLevels from "@/hooks/useAccessLevels";
import { baseApiUrl } from "@/static";
import axios from "axios";
import { useState } from "react";

function AccessLevelSettings() {
  const { accessLevels } = useAccessLevels();
  const [error, setError] = useState<string | undefined>(undefined);
  const [accessInput, setAccessInput] = useState<string | undefined>(undefined);

  const submitAccessLevel = async (accessInput: string) => {
    if (accessInput.length <= 0) return;
    try {
      await axios.post(`${baseApiUrl}/Api/AccessLevel`, {
        id: 0,
        name: accessInput,
        active: 1,
      });
    } catch (e) {
      setError("Could not perform action")
      setTimeout(() => {
        setError(undefined)
      }, 5000);
    }
    setAccessInput("")
  };

  const removeAccesslevel = async (id: number, payload: object) => {
    try {
      const response = await axios.put(
        `${baseApiUrl}/Api/AccessLevel?id=${id.toString()}`,
        payload
      );
      if (response.status >= 200 && response.status < 300)
        setError(response.statusText);
    } catch (e) {
      setError("Could not perform action")
      setTimeout(() => {
        setError(undefined)
      }, 5000);
    }
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
      <div id="access-list-container" className="flex flex-wrap mt-4">
        {accessLevels
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(
            (e, i) =>
              e.active === 1 && (
                <div
                  key={i}
                  className="p-2 mr-2 bg-primary/20 border border-primary rounded-md"
                >
                  {e.name}&nbsp;&nbsp;
                  <span
                    className="cursor-pointer px-1 text-danger"
                    onClick={() =>
                      removeAccesslevel(e.id, {
                        id: e.id,
                        name: e.name,
                        active: 0,
                      })
                    }
                  >
                    x
                  </span>
                </div>
              )
          )}
      </div>
    </>
  );
}

export default AccessLevelSettings;
