import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Home from "@/components/Home";
import NeedsAttention from "@/components/NeedsAttention";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="h-[90vh] flex items-center justify-center">
      <div
        id="dashboard-grid"
        className="h-max grid grid-cols-2 gap-4 *:bg-card *:shadow-md xl:max-w-8/12 xl:mx-auto"
      >
        <Home />
        <NeedsAttention />
      </div>
    </div>
  );
}
