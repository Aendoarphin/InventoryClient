import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import type { AccessLevel, Resource } from "@/types";
import { IconChevronDown, IconPlus, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useMemo, useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  description: string;
  items: AccessLevel[];
  newItemValue: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  placeholder: string;
  hasfilter?: boolean;
}

function CollapsibleSection({ title, isOpen, onToggle, description, items, newItemValue, onNewItemChange, onAddItem, onRemoveItem, placeholder, hasfilter }: CollapsibleSectionProps) {

  return (
    <div className="border border-gray-300 bg-white shadow-md">
      <button onClick={onToggle} className="w-full text-left p-4 text-lg font-medium flex items-center justify-between hover:bg-gray-50">
        <span>{title}</span>
        <IconChevronDown className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          <div className="flex gap-2 mb-4">
            <input type="text" value={newItemValue} onChange={(e) => onNewItemChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAddItem()} placeholder={placeholder} className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-success" />
            <button onClick={onAddItem} className="bg-success text-white px-4 py-2 flex items-center gap-2">
              <IconPlus size={18} />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No {title.toLowerCase()} yet</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100">
                  <span className="font-medium">{item.name}</span>
                  <button onClick={() => onRemoveItem(item.id)} className="text-danger hover:bg-red-50 p-2" aria-label={`Remove ${item.name}`}>
                    <IconTrash size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Settings() { // continue here work on settings page
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>([
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "User" },
    { id: 4, name: "Guest" },
    { id: 5, name: "Viewer" },
  ]);

  const [newAccessLevel, setNewAccessLevel] = useState("");
  const [newResource, setNewResource] = useState("");
  const [accessOpen, setAccessOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);

  const rawResources = useResources();
  const sortedResources = useMemo(() => [...rawResources].sort((a: Resource, b: Resource) => a.name.localeCompare(b.name)), [rawResources]);

  const addAccessLevel = () => {
    if (newAccessLevel.trim()) {
      setAccessLevels([...accessLevels, { id: Date.now(), name: newAccessLevel.trim() }]);
      setNewAccessLevel("");
    }
  };

  const removeAccessLevel = (id: number) => {
    setAccessLevels(accessLevels.filter((level) => level.id !== id));
  };

  const addResource = async () => {
    try {
      if (newResource.trim().toLowerCase()) {
        // Add your resource creation logic here
        console.log("Adding resource:", newResource);

        const response = await axios.post(`https:${import.meta.env.VITE_WEBAPI_HOST}/api/Resource`, { Id: 0, Name: newResource, CategoryId: 1 });

        window.alert(JSON.stringify(response.data));

        console.log("Resource was added!");
        setNewResource("");
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const removeResource = (id: number) => {
    // Add your resource deletion logic here
    console.log("Remove resource:", id);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="space-y-4">
        <CollapsibleSection
          title="Access Levels"
          isOpen={accessOpen}
          onToggle={() => setAccessOpen(!accessOpen)}
          description="Add/remove access levels. Each level can be used to categorize a resource. If a level is deleted, the access level badge on the resource will disappear"
          items={accessLevels}
          newItemValue={newAccessLevel}
          onNewItemChange={setNewAccessLevel}
          onAddItem={addAccessLevel}
          onRemoveItem={removeAccessLevel}
          placeholder="Enter access level name"
        />

        <CollapsibleSection
          title="Resources"
          isOpen={resourceOpen}
          onToggle={() => setResourceOpen(!resourceOpen)}
          description="Add/remove resources. If a resource is deleted, it will remain hidden in the employee's resource assignments list until it's added back."
          items={sortedResources}
          newItemValue={newResource}
          onNewItemChange={setNewResource}
          onAddItem={addResource}
          onRemoveItem={removeResource}
          placeholder="Enter resource name"
          hasfilter={true}
        />
      </div>
    </div>
  );
}

export default Settings;
