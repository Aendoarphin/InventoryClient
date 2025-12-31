import AccessLevelSettings from "@/components/AccessLevelSettings";
import DeviceSettings from "@/components/DeviceSettings";
import ResourceCategorySettings from "@/components/ResourceCategorySettings";
import ResourceSettings from "@/components/ResourceSettings";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

// continue here

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
    <div className="overflow-y-auto h-[80vh] inline-flex w-full">
      <div
        id="index-container"
        className="bg-card border w-max border-muted flex flex-col p-4 sticky bottom-0 *:not-first:hover:underline *:not-first:hover:cursor-pointer"
      >
        <h6>System Configuration</h6>
        <hr className="my-4 text-muted" />
        {
          settings.map(e => <p onClick={() => setView(e.component)} >{e.label}</p>)
        }
      </div>
      <div className="p-4 border border-muted border-l-0 w-full">
        {view ? view : <p>Choose A Setting</p>}
      </div>
    </div>
  );
}
