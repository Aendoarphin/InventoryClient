import useResourceCategories from "@/hooks/useResourceCategories";
import useTimedError from "@/hooks/useTimedError";
import { baseApiUrl } from "@/static";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

function ResourceCategorySettings() {
  const { resourceCategories, setRefresh } = useResourceCategories();
  const { error, setTimedError } = useTimedError(5000);
  const [categoryInput, setAccessInput] = useState<string | undefined>(
    undefined
  );

  const submitResourceCategory = async (categoryInput: string) => {
    if (categoryInput.length <= 0) return;
    try {
      const existingItem = resourceCategories.find(
        (e) => e.name.toLowerCase() === categoryInput.toLowerCase()
      );
      if (existingItem) {
        await axios.put(
          baseApiUrl + `/Api/ResourceCategory?id=${existingItem.id}`,
          {
            id: existingItem.id,
            name: existingItem.name,
            active: 1,
          }
        );
      } else {
        await axios.post(`${baseApiUrl}/Api/ResourceCategory`, {
          id: 0,
          name: categoryInput.toLowerCase(),
          active: 1,
        });
      }
    } catch (e) {
      
    }
    setRefresh((prev) => !prev);
    setAccessInput("");
  };

  const removeAccesslevel = async (id: number, payload: object) => {
    try {
      const response = await axios.put(
        `${baseApiUrl}/Api/ResourceCategory?id=${id.toString()}`,
        payload
      );
      if (response.status >= 300)
        setTimedError(response.statusText)
    } catch (e) {
      setTimedError("Could not perform action")
    }
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <div className="inline-flex justify-between w-full items-center">
        <div>
          <h6>Resource Categories</h6>
          <p className="text-muted">
            Add or delete resource categories which can be used to tag a
            resource. Categories are soft deleted and can be recovered.
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
            name="resource-category-name"
            id="resource-category-name"
            placeholder="Enter category name"
            className="px-2 outline-0"
            onChange={(e) => setAccessInput(e.currentTarget.value)}
            value={categoryInput}
          />
          <input
            type="button"
            value="+ Add"
            className="bg-success px-2 py-1 text-white active:contrast-50 disabled:contrast-25"
            disabled={!categoryInput || categoryInput.length <= 0}
            onClick={() => submitResourceCategory(categoryInput || "")}
          />
        </div>
      </div>
      <hr className="text-muted my-4" />
      <div
        id="category-list-container"
        className="flex flex-wrap gap-2 mt-4 *:uppercase"
      >
        {resourceCategories
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

export default ResourceCategorySettings;
