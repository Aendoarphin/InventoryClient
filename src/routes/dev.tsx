import SystemLog from "@/components/SystemLog"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dev')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SystemLog/>
}
