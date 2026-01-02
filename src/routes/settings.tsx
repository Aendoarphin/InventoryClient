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
  const [index, setIndex] = useState(0);

  return (
    <div className="overflow-y-auto shadow-sm min-w-5xl w-full container max-w-7xl mx-auto">
      <div
        id="index-container"
        className="bg-card border border-muted flex gap-2 items-center p-4 sticky bottom-0"
      >
        <h6>System Configuration</h6>
        <hr className="my-4 text-muted" />
        <div className="inline-flex gap-4 *:hover:cursor-pointer">
          {settings.map((e, i) => (
            <p
              key={i}
              onClick={() => setIndex(i)}
              className={index === i ? "border-b border-b-primary" : ""}
            >
              {e.label}
            </p>
          ))}
        </div>
      </div>
      {settings[index] && (
        <div className="p-4 border border-muted border-t-0 w-full">
          {settings[index].component}
        </div>
      )}
    </div>
  );
}
