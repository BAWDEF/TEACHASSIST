import React from 'react';
import Header from './Header'; // Adjust path if needed, e.g., './Header' if in same folder
import Sidebar from './Sidebar'; // Adjust path if needed

// Define the props for your Layout component.
// It should explicitly accept 'children' of type React.ReactNode.
interface LayoutProps {
  children: React.ReactNode;
}

// Ensure this is a consistent declaration and export
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar on the left */}
      <div className="w-64 bg-white shadow-lg hidden md:block"> {/* Responsive sidebar */}
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header at the top of the main content */}
        <Header />
        
        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; // <<< Ensure this is the ONLY default export for Layout in this file
