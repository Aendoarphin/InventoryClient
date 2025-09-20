function Navigation() {
  return (
    <nav className="p-4 *:inline bg-primary sticky top-0 shadow-sm">
      <h2>{import.meta.env.VITE_COMPANY_NAME}</h2>&nbsp;&nbsp;<h5 className="underline">Inventory Manager</h5>
    </nav>
  )
}

export default Navigation