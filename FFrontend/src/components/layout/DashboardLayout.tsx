import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'freelancer' | 'employer';
}

export default function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav userType={userType} />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8 max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
