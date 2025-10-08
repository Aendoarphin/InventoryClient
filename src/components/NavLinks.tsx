import { Link } from "@tanstack/react-router"

function NavLinks() {
  return (
    <div className="w-min flex *:p-2 **:hover:underline **:text-shadow-lg *:font-bold *:text-lg">
      <Link to="/">Home</Link>
    </div>
  )
}

export default NavLinks