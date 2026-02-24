import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Dashboard from "@/components/Dashboard";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <>
      <Dashboard />
    </>
  );
}
