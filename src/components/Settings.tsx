import useAccessLevels from "@/hooks/useAccessLevels";
import useResourceCategories from "@/hooks/useResourceCategories";
import useResources from "@/hooks/useResources";
import type { AccessLevel, Resource, ResourceCategory } from "@/types";
import { IconChevronDown, IconPlus, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  description: string;
  items: AccessLevel[] | Resource[] | ResourceCategory[];
  newItemValue: string;
  onNewItemChange: (value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: number) => void;
  placeholder: string;
  additionalInputs?: React.ReactNode;
  isAddDisabled?: boolean;
  warning?: string;
}

function CollapsibleSection({ 
  title, 
  isOpen, 
  onToggle, 
  description, 
  items, 
  newItemValue, 
  onNewItemChange, 
  onAddItem, 
  onRemoveItem, 
  placeholder, 
  additionalInputs, 
  isAddDisabled = false,
  warning 
}: CollapsibleSectionProps) {
  return (
    <div className="border border-gray-300 bg-white shadow-md">
      <button onClick={onToggle} className="w-full text-left p-4 text-lg font-medium flex items-center justify-between hover:bg-gray-50">
        <span>{title}</span>
        <IconChevronDown className={`w-5 h-5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newItemValue} 
                onChange={(e) => onNewItemChange(e.target.value)} 
                onKeyDown={(e) => e.key === "Enter" && !isAddDisabled && onAddItem()} 
                placeholder={placeholder} 
                className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-success" 
              />
              <button 
                onClick={onAddItem} 
                disabled={isAddDisabled} 
                className="bg-success text-white px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconPlus size={18} />
                Add
              </button>
            </div>
            {warning && (
              <p className="text-red-600 text-sm">{warning}</p>
            )}
            {additionalInputs}
          </div>

          <div className="space-y-2">
            {items?.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No {title.toLowerCase()} yet</p>
            ) : (
              items?.map((item) => (
                <div 
                  key={item.id} 
                  hidden={Object.hasOwn(item, "active") && (item as AccessLevel | ResourceCategory).active === 0} 
                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:bg-gray-100"
                >
                  <span className="font-medium">{item.name}</span>
                  <button 
                    onClick={() => onRemoveItem(item.id)} 
                    className="text-danger hover:bg-red-50 p-2" 
                    aria-label={`Remove ${item.name}`}
                  >
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

type EntityType = "accessLevel" | "resource" | "resourceCategory";

interface EntityConfig {
  endpoint: string;
  createPayload: (name: string, extras?: any) => any;
  duplicateCheck?: (name: string, items: any[]) => boolean;
}

const ENTITY_CONFIGS: Record<EntityType, EntityConfig> = {
  accessLevel: {
    endpoint: "/api/AccessLevel",
    createPayload: (name) => ({ id: 0, name, active: 1 }),
    duplicateCheck: (name, items) => items.some((item) => item.name.trim().toLowerCase() === name.trim().toLowerCase()),
  },
  resource: {
    endpoint: "/api/Resource",
    createPayload: (name, extras) => ({
      id: 0,
      name,
      categoryId: extras?.categoryId || 0,
      accessLevelId: extras?.accessLevelId || 0,
    }),
  },
  resourceCategory: {
    endpoint: "/api/ResourceCategory",
    createPayload: (name) => ({ id: 0, name, active: 1 }),
  },
};

function Settings() {
  const [newAccessLevel, setNewAccessLevel] = useState("");
  const [newResource, setNewResource] = useState("");
  const [newResourceCategory, setNewResourceCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [selectedAccessLevelId, setSelectedAccessLevelId] = useState<number>(0);

  const [accessOpen, setAccessOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [resourceCategoryOpen, setResourceCategoryOpen] = useState(false);

  const [accessLevelWarning, setAccessLevelWarning] = useState("");
  const [resourceWarning, setResourceWarning] = useState("");
  const [resourceCategoryWarning, setResourceCategoryWarning] = useState("");

  const [accessLevels, setAccessLevels] = useAccessLevels();
  const [resources, setResources] = useResources();
  const [resourceCategories, setResourceCategories] = useResourceCategories();

  const baseApiUrl = `https://${import.meta.env.VITE_WEBAPI_HOST}`;

  const refetchData = async (type: EntityType) => {
    try {
      const config = ENTITY_CONFIGS[type];
      const res = await axios.get(`${baseApiUrl}${config.endpoint}`);

      if (type === "accessLevel") {
        setAccessLevels(res.data);
      } else if (type === "resource") {
        setResources(res.data);
      } else if (type === "resourceCategory") {
        setResourceCategories(res.data);
      }
    } catch (error) {
      console.error(`Error refetching ${type}:`, error);
    }
  };

  const createEntity = async (type: EntityType, name: string, items: any[], clearInput: () => void, extras?: any) => {
    const setWarning = type === "accessLevel" ? setAccessLevelWarning : type === "resource" ? setResourceWarning : setResourceCategoryWarning;
    
    try {
      if (!name.trim()) {
        setWarning("Please enter a name");
        return;
      }

      const config = ENTITY_CONFIGS[type];

      // For accessLevel and resourceCategory, check if item exists and soft-add if needed
      if (type === "accessLevel" || type === "resourceCategory") {
        const existingItem = items.find((item) => item.name.trim().toLowerCase() === name.trim().toLowerCase());

        if (existingItem) {
          // If item exists but is inactive, soft-add it by setting active to 1
          if (existingItem.active === 0) {
            await axios.put(`${baseApiUrl}${config.endpoint}?id=${existingItem.id}`, { ...existingItem, active: 1 });
            await refetchData(type);
            setWarning("");
          } else {
            setWarning(`This ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} already exists and is active`);
          }
          clearInput();
          return;
        }
      }

      // Check for duplicates for resources
      if (config.duplicateCheck && config.duplicateCheck(name, items)) {
        setWarning(`This ${type.replace(/([A-Z])/g, ' $1').toLowerCase()} already exists`);
        return;
      }

      const response = await axios.post(`${baseApiUrl}${config.endpoint}`, config.createPayload(name, extras));

      await refetchData(type);
      clearInput();
      setWarning("");
    } catch (error) {
      setWarning(`Error adding the ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      console.error(error);
    }
  };

  const deleteEntity = async (type: EntityType, id: number) => {
    try {
      const config = ENTITY_CONFIGS[type];

      // For accessLevel and resourceCategory, soft delete by setting active to 0
      if (type === "accessLevel" || type === "resourceCategory") {
        const item = (type === "accessLevel" ? accessLevels : resourceCategories).find((i) => i.id === id);
        if (item) {
          await axios.put(`${baseApiUrl}${config.endpoint}?id=${id}`, { ...item, active: 0 });
          await refetchData(type);
        }
      } else {
        // For resources, perform actual delete
        await axios.delete(`${baseApiUrl}${config.endpoint}?id=${id}`);
        await refetchData(type);
      }
    } catch (error) {
      const setWarning = type === "accessLevel" ? setAccessLevelWarning : type === "resource" ? setResourceWarning : setResourceCategoryWarning;
      setWarning(`Error removing the ${type.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      console.error(error);
    }
  };

  const handleAddResource = () => {
    if (selectedCategoryId === 0) {
      setResourceWarning("Please select a Resource Category for this resource");
      return;
    }

    if (selectedAccessLevelId === 0) {
      setResourceWarning("Please select an Access Level for this resource");
      return;
    }

    createEntity(
      "resource",
      newResource,
      resources,
      () => {
        setNewResource("");
        setSelectedCategoryId(0);
        setSelectedAccessLevelId(0);
      },
      {
        categoryId: selectedCategoryId,
        accessLevelId: selectedAccessLevelId,
      }
    );
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
          items={accessLevels.filter((e) => e.active === 1)}
          newItemValue={newAccessLevel}
          onNewItemChange={(value) => {
            setNewAccessLevel(value);
            setAccessLevelWarning("");
          }}
          onAddItem={() => createEntity("accessLevel", newAccessLevel, accessLevels, () => setNewAccessLevel(""))}
          onRemoveItem={(id) => deleteEntity("accessLevel", id)}
          placeholder="Enter access level name"
          warning={accessLevelWarning}
        />
        <CollapsibleSection
          title="Resource Categories"
          isOpen={resourceCategoryOpen}
          onToggle={() => setResourceCategoryOpen(!resourceCategoryOpen)}
          description="Add/remove resource categories. If a resource category is deleted, it will remain hidden in the employee's resource assignments list until it's added back."
          items={resourceCategories.filter((e) => e.active === 1)}
          newItemValue={newResourceCategory}
          onNewItemChange={(value) => {
            setNewResourceCategory(value);
            setResourceCategoryWarning("");
          }}
          onAddItem={() => createEntity("resourceCategory", newResourceCategory, resourceCategories, () => setNewResourceCategory(""))}
          onRemoveItem={(id) => deleteEntity("resourceCategory", id)}
          placeholder="Enter resource category name"
          warning={resourceCategoryWarning}
        />
        <CollapsibleSection
          title="Resources"
          isOpen={resourceOpen}
          onToggle={() => setResourceOpen(!resourceOpen)}
          description="Add/remove resources. If a resource is deleted, it will remain hidden in the employee's resource assignments list until it's added back."
          items={resources}
          newItemValue={newResource}
          onNewItemChange={(value) => {
            setNewResource(value);
            setResourceWarning("");
          }}
          onAddItem={handleAddResource}
          onRemoveItem={(id) => deleteEntity("resource", id)}
          placeholder="Enter resource name"
          isAddDisabled={selectedCategoryId === 0 || selectedAccessLevelId === 0}
          warning={resourceWarning}
          additionalInputs={
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={selectedCategoryId} 
                  onChange={(e) => {
                    setSelectedCategoryId(Number(e.target.value));
                    setResourceWarning("");
                  }} 
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-success" 
                  disabled={!resourceCategories || resourceCategories.length === 0}
                >
                  <option value={0}>None</option>
                  {resourceCategories
                    .filter((e) => e.active === 1)
                    ?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                <select 
                  value={selectedAccessLevelId} 
                  onChange={(e) => {
                    setSelectedAccessLevelId(Number(e.target.value));
                    setResourceWarning("");
                  }} 
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-success" 
                  disabled={!accessLevels || accessLevels.length === 0}
                >
                  <option value={0}>None</option>
                  {accessLevels
                    .filter((e) => e.active === 1)
                    ?.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Settings;