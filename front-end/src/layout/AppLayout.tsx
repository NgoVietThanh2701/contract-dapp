import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { Outlet } from 'react-router';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';

const LayoutContent: React.FC<any> = ({
  web3Provider,
  address,
  disconnectWallet
}) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader address={address} disconnectWallet={disconnectWallet} />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet context={{ web3Provider, address }} />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC<any> = ({
  web3Provider,
  address,
  disconnectWallet
}) => {
  return (
    <SidebarProvider>
      <LayoutContent
        web3Provider={web3Provider}
        address={address}
        disconnectWallet={disconnectWallet}
      />
    </SidebarProvider>
  );
};

export default AppLayout;
