import useResourceCategories from "@/hooks/useResourceCategories";
import useTimedError from "@/hooks/useTimedError";
import { baseApiUrl } from "@/static";
import { IconLayoutGrid, IconList, IconSearch, IconSortAscendingLetters, IconSortDescendingLetters } from "@tabler/icons-react";
import axios from "axios";
import { useState, useMemo } from "react";

type ViewMode = "grid" | "list";
type SortOrder = "asc" | "desc";

function ResourceCategorySettings() {
  const { resourceCategories, setRefresh } = useResourceCategories();
  const { error, setTimedError } = useTimedError(5000);
  const [categoryInput, setAccessInput] = useState<string | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelected = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
      setTimedError("Could not perform action");
    }
    setRefresh((prev) => !prev);
    setAccessInput("");
  };

  const removeSelected = async () => {
    try {
      await Promise.all(
        selectedIds.map((id) => {
          const item = resourceCategories.find((e) => e.id === id);
          if (!item) return Promise.resolve();
          return axios.put(`${baseApiUrl}/Api/ResourceCategory?id=${id}`, {
            id: item.id,
            name: item.name,
            active: 0,
          });
        })
      );
    } catch (e) {
      setTimedError("Could not perform action");
    }
    setSelectedIds([]);
    setRefresh((prev) => !prev);
  };

  const filteredAndSorted = useMemo(() => {
    return resourceCategories
      .filter((e) => e.active === 1)
      .filter((e) =>
        searchQuery.trim() === "" ? true : e.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [resourceCategories, searchQuery, sortOrder]);

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

      {/* Toolbar */}
      <div className="inline-flex items-center gap-2 w-full mb-4">
        <div className="inline-flex items-center border border-muted h-max flex-1 max-w-xs">
          <span className="px-2 text-muted">
            <IconSearch size={14} />
          </span>
          <input
            type="text"
            placeholder="Search categories..."
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
        <div
          id="category-list-container"
          className="flex flex-wrap gap-2 *:uppercase"
        >
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
              {e.name}
            </label>
          ))}
          {filteredAndSorted.length === 0 && (
            <p className="text-muted text-sm">No categories found.</p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {filteredAndSorted.map((e, i) => (
            <label
              key={i}
              className={`cursor-pointer select-none inline-flex items-center gap-3 px-3 py-2 border border-muted uppercase text-sm ${
                selectedIds.includes(e.id) ? "ring-2 ring-danger opacity-75 bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                className="accent-danger"
                checked={selectedIds.includes(e.id)}
                onChange={() => toggleSelected(e.id)}
              />
              {e.name}
            </label>
          ))}
          {filteredAndSorted.length === 0 && (
            <p className="text-muted text-sm">No categories found.</p>
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

export default ResourceCategorySettings;
