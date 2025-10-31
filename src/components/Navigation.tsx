import { Link } from "@tanstack/react-router";
import NavLinks from "./NavLinks";

function Navigation() {
  return (
    <header>
      <nav className="p-4 bg-primary sticky top-0 shadow-sm flex flex-row justify-between z-40 text-white">
        <Link to="/" className="text-shadow-lg">
          <h2 className="inline">{import.meta.env.VITE_COMPANY_NAME}</h2>&nbsp;&nbsp;
          <h5 className="underline inline">Inventory Manager</h5>
        </Link>
        <NavLinks />
      </nav>
    </header>
  );
}

export default Navigation;
