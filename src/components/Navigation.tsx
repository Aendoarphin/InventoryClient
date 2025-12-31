import { Link } from "@tanstack/react-router";
import NavLinks from "./NavLinks";

function Navigation() {
  return (
    <header className="sticky top-0 z-3">
      <nav className="p-2 bg-primary shadow-sm flex flex-row items-center justify-between z-40 text-white">
        <Link to="/" className="">
          <h4 className="inline">{import.meta.env.VITE_COMPANY_NAME}</h4>&nbsp;&nbsp;
          <p className="underline inline">Inventory Manager</p>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}

export default Navigation;
