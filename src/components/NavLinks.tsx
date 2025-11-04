import { IconSettings } from "@tabler/icons-react"
import { Link } from "@tanstack/react-router"

function NavLinks() {
  return (
    <div className={`w-min flex *:p-2 **:hover:underline **:text-shadow-lg *:font-bold *:text-lg items-center`}>
      <Link to="/">Home</Link>
      <Link to="/manage/Vendor">Vendors</Link>
      <Link to="/manage/Item">Items</Link>
      <Link to="/manage/Employee">Employees</Link>
      <Link to="/settings" className=" drop-shadow-lg"><IconSettings/></Link>
    </div>
  )
}

export default NavLinks