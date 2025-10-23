import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Home from "@/components/Home";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="place-content-center fixed top-0 bottom-0 left-0 right-0">
      <Home />
    </div>
  );
}
