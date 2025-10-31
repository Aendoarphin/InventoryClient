import EmployeeList from "@/components/EmployeeList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manage/Employee")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EmployeeList />;
}
