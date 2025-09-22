import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import InventoryCard from "@/components/InventoryCards";
import NeedsAttention from "@/components/NeedsAttention";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <div
        id="dashboard-grid"
        className="h-min grid grid-cols-2 gap-4 *:bg-card *:shadow-md xl:max-w-8/12 xl:mx-auto"
      >
        <InventoryCard />
        <NeedsAttention />
      </div>
    </>
  );
}
