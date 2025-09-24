import InventoryTable from '@/components/InventoryTable'
import useItems from '@/hooks/useItems'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/manage/items')({
  component: RouteComponent,
})

function RouteComponent() {
  const items = useItems();
  const [itemsCount, setItemsCount] = useState(0)
  return (
    <>
    <div className="container mx-auto flex flex-row justify-between items-center">
      <h2>Items</h2>
      <p className='text-muted'>Showing {itemsCount} items out of {items.length}</p>
    </div>
    <InventoryTable table={items} count={setItemsCount} />
    </>
  )
}
