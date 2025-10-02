import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Home from "@/components/Home";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="flex items-center fixed top-0 bottom-0 left-0 right-0">
      <div
        id="dashboard-grid"
        className="h-max mx-auto grid grid-cols-2 gap-4 *:bg-card *:shadow-md xl:max-w-8/12 xl:mx-auto"
      >
        <Home />
      </div>
    </div>
  );
}
