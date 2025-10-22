import { createFileRoute } from '@tanstack/react-router'
import ShareMyTip from '../components/ShareMyTip';
import { useAccount } from "wagmi";

export const Route = createFileRoute('/sharetip')({
  component: RouteComponent,
})

function RouteComponent() {
  const { address } = useAccount();

  return (<div>
    <ShareMyTip myAddress={address} />
  </div>)
}
