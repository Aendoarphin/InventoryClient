import NavLinks from "./NavLinks";

function Navigation() {
  return (
    <nav className="p-4 bg-primary sticky top-0 shadow-sm flex flex-row justify-between z-40">
      <div>
        <h2 className="inline">{import.meta.env.VITE_COMPANY_NAME}</h2>&nbsp;&nbsp;
        <h5 className="underline inline">Inventory Manager</h5>
      </div>
      <NavLinks />
    </nav>
  );
}

export default Navigation;
