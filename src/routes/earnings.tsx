import { createFileRoute } from '@tanstack/react-router'
import TipJarTippedFeed from '@/components/TipJarTippedFeed'

export const Route = createFileRoute('/earnings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <TipJarTippedFeed />
  </div>
}
