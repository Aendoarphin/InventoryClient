import { Link } from "@tanstack/react-router"

function NavLinks() {
  return (
    <div className="w-min flex *:p-2 **:hover:underline">
      <Link to="/">Home</Link>
    </div>
  )
}

export default NavLinks