import { Link, useLocation } from "@tanstack/react-router";
import { IconDashboard, IconSettings, IconUser } from "@tabler/icons-react";

// paths to add:
// - /
// - /manage/Item
// - /manage/Vendor
// - /manage/Employee
// - /settings

// company name: import.meta.env.VITE_COMPANY_NAME

function Navigation() {
  const links = [
    { to: "/", label: "Dashboard", icon: <IconDashboard /> },
    { to: "/manage/Employee", label: "Employees", icon: <IconUser /> },
    { to: "/settings", label: "Settings", icon: <IconSettings /> },
  ]
  const currLocation = useLocation().pathname;
  document.title = `${import.meta.env.VITE_COMPANY_NAME} | ${links.find(link => link.to === currLocation)?.label || "Page Not Found"}`;

  return (
    <header className="w-max bg-primary">
      <aside>
        <nav className="flex flex-col *:p-2">
          <strong className="text-wrap">{import.meta.env.VITE_COMPANY_NAME}</strong>
          {
            links.map(link => (
              <Link key={link.to} to={link.to} className={`flex items-center gap-2 py-2 px-3 hover:bg-background/50 transition-colors not-last:border-b ${currLocation === link.to && "border-l-6"}`}>
                {link.icon}
                {link.label}
              </Link>
            ))
          }
        </nav>
      </aside>
    </header>
  )
}

export default Navigation;
