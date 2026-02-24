import { createRootRoute } from "@tanstack/react-router";
import Root from "@/components/Root";

export const Route = createRootRoute({
  component: () => (
    <Root/>
  ),
  notFoundComponent: () => <>404: This Page Does Not Exist</>,
});
