import React, { memo } from "react";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = memo<ILayoutProps>(({ children }) => (
  <main className="font-lato text-gray relative grid min-h-screen grid-rows-[min-content_1fr_min-content]">
    {children}
  </main>
));

export default Layout;
