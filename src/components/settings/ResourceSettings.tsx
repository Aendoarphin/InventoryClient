import useAccessLevels from "@/hooks/useAccessLevels";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import { baseApiUrl, showError } from "@/static";
import { IconLayoutGrid, IconList, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-react";
import type { Resource } from "@/types";
import axios from "axios";
import { useState, useMemo } from "react";

type ViewMode = "grid" | "list";
type SortOrder = "asc" | "desc";

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
  const [selectInputs, setSelectInputs] = useState({ access: "", category: "" });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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

  const removeSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const resource = resources.find((r) => r.id === id);
          if (!resource) return Promise.resolve();
          return axios.put(`${baseApiUrl}/Api/Resource?id=${id}`, {
            id: resource.id,
            name: resource.name,
            categoryId: resource.categoryId,
            accessLevelId: resource.accessLevelId,
            active: 0,
          });
        })
      );
      setSelectedIds([]);
      resetStates();
    } catch (error) {
      showError(setError);
    }
  };

  // For list view: flat filtered + sorted list across all categories
  const flatFilteredAndSorted = useMemo(() => {
    return resources
      .filter((e) => e.active === 1)
      .filter((e) =>
        searchQuery.trim() === "" ? true : e.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [resources, searchQuery, sortOrder]);

  // For grid view: resources per category, filtered + sorted
  const resourcesByCategory = useMemo(() => {
    return resourceCategories
      .filter((rc) => rc.active === 1)
      .map((rc) => ({
        category: rc,
        items: resources
          .filter(
            (r) =>
              r.active === 1 &&
              r.categoryId === rc.id &&
              (searchQuery.trim() === ""
                ? true
                : r.name.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .sort((a, b) =>
            sortOrder === "asc"
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          ),
      }))
      .filter((group) => group.items.length > 0 || searchQuery.trim() === "");
  }, [resources, resourceCategories, searchQuery, sortOrder]);

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
            setInputResource({ ...inputResource, name: e.currentTarget.value })
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
            setSelectInputs({ ...selectInputs, category: e.currentTarget.value })
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

      {/* Toolbar */}
      <div className="inline-flex items-center gap-2 w-full mb-4">
        <div className="inline-flex items-center border border-muted h-max flex-1 max-w-xs">
          <span className="px-2 text-muted">
            <IconSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search resources..."
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
      {viewMode === "grid" ? (
        <div className="flex flex-col gap-2">
          {resourcesByCategory.map(({ category, items }, i) => (
            <div key={i} className="mb-4">
              <h6>{category.name}</h6>
              <hr className="my-4 text-muted" />
              <div className="flex flex-wrap gap-2 *:uppercase text-xs">
                {items.length > 0 ? (
                  items.map((resource, j) => (
                    <label
                      key={j}
                      className={`item-chips cursor-pointer select-none inline-flex items-center gap-2 ${
                        selectedIds.includes(resource.id)
                          ? "ring-2 ring-danger opacity-75"
                          : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-danger"
                        checked={selectedIds.includes(resource.id)}
                        onChange={() => toggleSelected(resource.id)}
                      />
                      {resource.name}
                    </label>
                  ))
                ) : (
                  <p className="text-muted text-xs">No resources match your search.</p>
                )}
              </div>
            </div>
          ))}
          {resourcesByCategory.length === 0 && (
            <p className="text-muted text-sm">No resources found.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {flatFilteredAndSorted.map((resource, i) => {
            const category = resourceCategories.find((rc) => rc.id === resource.categoryId);
            return (
              <label
                key={i}
                className={`cursor-pointer select-none inline-flex items-center gap-3 px-3 py-2 border border-muted text-sm uppercase ${
                  selectedIds.includes(resource.id)
                    ? "ring-2 ring-danger opacity-75 bg-red-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-danger"
                  checked={selectedIds.includes(resource.id)}
                  onChange={() => toggleSelected(resource.id)}
                />
                <span className="flex-1">{resource.name}</span>
                {category && (
                  <span className="text-muted text-xs normal-case">{category.name}</span>
                )}
              </label>
            );
          })}
          {flatFilteredAndSorted.length === 0 && (
            <p className="text-muted text-sm">No resources found.</p>
          )}
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

export default ResourceSettings;
