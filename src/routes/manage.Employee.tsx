import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manage/Employee')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 border items-center content-center **:border **:border-muted'>
      <div>
        employee page
      </div>
    </div>
  )
}
