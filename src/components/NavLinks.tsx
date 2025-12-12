import { IconSettings } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

function NavLinks() {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className={`w-min flex *:p-2 *:hover:underline **:text-shadow-lg *:font-bold *:text-lg items-center`}
    >
      <Link to="/">Home</Link>
      <Link to="/manage/Employee">Employees</Link>
      {/* Container link that shows sublinks on hover */}
      <div
        className="cursor-pointer relative group"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        Tables
        {visible && (
          <div className="bg-card absolute *:p-2 border border-muted text-black flex flex-col">
            <Link className="font-normal text-sm hover:bg-secondary hover:text-white" to="/manage/Vendor">
              Vendors
            </Link>
            <Link className="font-normal text-sm hover:bg-secondary hover:text-white" to="/manage/Item">
              Items
            </Link>
          </div>
        )}
      </div>
      <Link to="/settings" className=" drop-shadow-lg">
        <IconSettings />
      </Link>
    </div>
  );
}

export default NavLinks;
