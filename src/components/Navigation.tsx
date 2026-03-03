import { Link, useLocation } from "@tanstack/react-router";
import { IconDashboard, IconLayoutSidebarRightCollapse, IconSettings, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";

function Navigation() {
  const links = [
    { to: "/", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/manage/Employee", label: "Employees", icon: <IconUser /> },
    { to: "/settings", label: "Settings", icon: <IconSettings /> },
  ];

  const currLocation = useLocation().pathname;

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.title = `${import.meta.env.VITE_COMPANY_NAME} | ${links.find((link) => link.to === currLocation)?.label || "Page Not Found"}`;
  }, [currLocation]);

  return (
    <header className="text-white w-max relative flex flex-row">
      <aside className={`${isOpen ? "" : "hidden"} overflow-hidden bg-primary transition-all`}>
        <nav className="flex flex-col *:p-2">
          <strong className="text-nowrap">{import.meta.env.VITE_COMPANY_NAME}</strong>
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={`flex items-center gap-2 py-2 px-3 hover:bg-background/50 transition-colors not-last:border-b border-black/50 ${currLocation === link.to && "border-l-6"}`}>
              {link.icon}
              <p className="font-semibold">{link.label}</p>
            </Link>
          ))}
        </nav>
      </aside>
      <div className="bg-card border border-r border-r-muted p-1">{!isOpen ? (<IconLayoutSidebarRightCollapse className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} color="var(--primary)" />) : (<IconLayoutSidebarRightCollapse className="cursor-pointer rotate-180" onClick={() => setIsOpen(!isOpen)} color="var(--primary)" />)}</div>
    </header>
  );
}

export default Navigation;
