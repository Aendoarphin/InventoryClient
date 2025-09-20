import { createFileRoute } from '@tanstack/react-router'
import '../App.css'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <>
      <div id='dashboard-container' className='m-4 grid grid-cols-2 gap-4 *:bg-neutral-100 *:shadow-sm'>
        <div className='min-h-40 p-4 flex flex-col justify-between'>
          <h2 className='border'>Table Name</h2>
          <div><h6>Total</h6><p>12857</p></div>
        </div>
        <div></div>
      </div>
    </>
  )
}
