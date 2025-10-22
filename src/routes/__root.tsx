import { createRootRoute, Outlet } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const RootLayout = () => (
  <div className='max-w-6xl mx-auto font-montserrat'>
    <NavBar />
    <Outlet />
    <Footer />
    {/* <TanStackRouterDevtools /> */}
  </div>
)

export const Route = createRootRoute({ component: RootLayout })