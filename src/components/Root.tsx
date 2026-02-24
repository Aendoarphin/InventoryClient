import { Outlet } from "@tanstack/react-router"
import Navigation from "./Navigation"
import Footer from "./Footer"
import useDebugTools from "@/hooks/useDebugTools";

function Root() {
  const { setBorders } = useDebugTools();
  return (
    <div>
      <div className="inline-flex w-full h-screen">
        <Navigation />
        <Outlet />
      </div>
      <Footer />
      {
        import.meta.env.DEV && (
          <div className="fixed bottom-10 right-0 border bg-green-400/50 text-xs">
            <label htmlFor="debug-border">Borders</label>&nbsp;<input id="debug-border" type="checkbox" onChange={(e) => setBorders(e.target.checked)} />
          </div>
        )
      }
    </div>
  )
}

export default Root