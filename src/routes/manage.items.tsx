import ItemManagement from '@/components/ItemManagement'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/items')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ItemManagement/>
  )
}
