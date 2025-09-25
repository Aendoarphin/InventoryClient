import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manage/Vendor")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>Vendor Management Page</div>
  );
}
