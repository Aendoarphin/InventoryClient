import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manage/vendors")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-red-300">items</div>
  );
}
