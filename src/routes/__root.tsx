import { Outlet, createRootRoute } from "@tanstack/react-router";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const Route = createRootRoute({
  component: () => (
    <>
      <Navigation />
      <div className="m-4">
        <Outlet />
      </div>
      <Footer />
    </>
  ),
  notFoundComponent: () => <>404: This Page Does Not Exist</>
});
