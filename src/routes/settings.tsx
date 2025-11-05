import Settings from '@/components/Settings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='fixed w-full overflow-y-auto h-10/12'>
      <Settings/>
    </div>
  )
}
