import AccessLevelSettings from "@/components/settings/AccessLevelSettings";
import DeviceSettings from "@/components/settings/DeviceSettings";
import ResourceCategorySettings from "@/components/settings/ResourceCategorySettings";
import ResourceSettings from "@/components/settings/ResourceSettings";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

const settings = [
  {
    label: "Access Levels",
    value: "access-levels",
    component: <AccessLevelSettings />,
  },
  {
    label: "Devices",
    value: "devices",
    component: <DeviceSettings />,
  },
  {
    label: "Resource Categories",
    value: "resource-categories",
    component: <ResourceCategorySettings />,
  },
  {
    label: "Resources",
    value: "resources",
    component: <ResourceSettings />,
  },
];

function RouteComponent() {
  const [view, setView] = useState<React.ReactElement | undefined>(undefined);

  return (
    <div className="overflow-y-auto shadow-sm min-w-5xl w-full container max-w-7xl mx-auto">
      <div
        id="index-container"
        className="bg-card border border-muted flex gap-2 items-center p-4 sticky bottom-0"
      >
        <h6>System Configuration</h6>
        <hr className="my-4 text-muted" />
        <div className="inline-flex gap-4 *:hover:underline *:hover:cursor-pointer">
          {settings.map((e) => (
            <p onClick={() => setView(e.component)}>{e.label}</p>
          ))}
        </div>
      </div>
      {view && (
        <div className="p-4 border border-muted border-t-0 w-full">{view}</div>
      )}
    </div>
  );
}
