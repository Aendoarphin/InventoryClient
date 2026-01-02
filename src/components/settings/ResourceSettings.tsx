import useAccessLevels from "@/hooks/useAccessLevels";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import { baseApiUrl, showError } from "@/static";
import type { Resource } from "@/types";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

const EMPTY_RESOURCE = {
  id: 0,
  name: "",
  categoryId: 0,
  accessLevelId: 0,
  active: 0,
};

function ResourceSettings() {
  const { accessLevels } = useAccessLevels();
  const { resources, setRefresh } = useResources();
  const { resourceCategories } = useResourceCategories();
  const [error, setError] = useState<string | undefined>(undefined);
  const [inputResource, setInputResource] = useState<Resource>(EMPTY_RESOURCE);
  const [selectInputs, setSelectInputs] = useState({
    access: "",
    category: "",
  });

  const resetStates = () => {
    setError(undefined);
    setSelectInputs({ access: "", category: "" });
    setInputResource({ ...EMPTY_RESOURCE });
    setRefresh((prev) => !prev);
  };

  const submitInputResource = async (inputResource: Resource) => {
    try {
      const existingItem = resources.find(
        (e) => e.name.toLowerCase() === inputResource.name.toLowerCase()
      );
      if (existingItem) {
        await axios.put(`${baseApiUrl}/Api/Resource?id=${existingItem.id}`, {
          ...existingItem,
          active: 1,
        });
      } else {
        await axios.post(`${baseApiUrl}/Api/Resource`, {
          id: 0,
          name: inputResource.name.toLowerCase(),
          categoryId: resourceCategories.find(
            (rc) => rc.name === selectInputs.category
          )?.id,
          accessLevelId: accessLevels.find(
            (a) => a.name === selectInputs.access
          )?.id,
          active: 1,
        });
      }
      resetStates();
    } catch (error) {
      showError(setError);
    }
  };

  const removeResource = async (id: number, data: Resource) => {
    try {
      await axios.put(`${baseApiUrl}/Api/Resource?id=${id}`, data);
      resetStates();
    } catch (error) {
      showError(setError);
    }
  };

  return (
    <>
      <div className="inline-flex gap-2 items-center w-full">
        <h6>Resources</h6>
        <p className="text-muted">
          Add or delete employee resources. Resources are soft deleted and can
          be recovered.
        </p>
        <p className="ml-auto text-danger">{error}</p>
      </div>
      <div className="inline-flex items-center border border-muted h-max mt-2 *:not-first:border-l *:not-first:border-l-muted">
        <input
          type="text"
          name="resource-category-name"
          id="resource-category-name"
          placeholder="Enter resource name"
          className="px-2 outline-0"
          onChange={(e) =>
            setInputResource({
              ...inputResource,
              name: e.currentTarget.value,
            })
          }
          value={inputResource.name}
        />
        <select
          value={selectInputs.access}
          name="access-level-options"
          id="access-level-options"
          className="uppercase px-2"
          onChange={(e) =>
            setSelectInputs({ ...selectInputs, access: e.currentTarget.value })
          }
        >
          <option value={""}>Choose Access Level</option>
          {accessLevels.map((e) => e.active === 1 && <option>{e.name}</option>)}
        </select>
        <select
          value={selectInputs.category}
          name="category-options"
          id="category-options"
          className="uppercase px-2"
          onChange={(e) =>
            setSelectInputs({
              ...selectInputs,
              category: e.currentTarget.value,
            })
          }
        >
          <option value={""}>Choose Category</option>
          {resourceCategories.map(
            (e) => e.active === 1 && <option>{e.name}</option>
          )}
        </select>
        <input
          type="button"
          value="+ Add"
          className="bg-success px-2 py-1 text-white active:contrast-50 disabled:contrast-25"
          disabled={
            inputResource.name.length <= 0 ||
            selectInputs.access.length <= 0 ||
            selectInputs.category.length <= 0
          }
          onClick={() => submitInputResource(inputResource)}
        />
      </div>
      <hr className="text-muted my-4" />
      <div className="flex flex-col gap-2">
        {resourceCategories.map(
          (rc, i) =>
            rc.active === 1 && (
              <div key={i}>
                <h6 className="mb-2">{rc.name}</h6>
                <div className="flex flex-wrap gap-2 *:uppercase text-xs">
                  {resources
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(
                      (resource, j) =>
                        resource.active === 1 &&
                        resource.categoryId === rc.id && (
                          <div
                            key={j}
                            className="rounded-md flex items-center border border-primary bg-primary/20 p-2"
                          >
                            {resource.name}
                            <IconTrash
                              className="cursor-pointer px-1 text-danger"
                              onClick={() =>
                                removeResource(resource.id, {
                                  id: resource.id,
                                  name: resource.name,
                                  categoryId: resource.categoryId,
                                  accessLevelId: resource.accessLevelId,
                                  active: 0,
                                })
                              }
                            />
                          </div>
                        )
                    )}
                </div>
              </div>
            )
        )}
      </div>
    </>
  );
}

export default ResourceSettings;
