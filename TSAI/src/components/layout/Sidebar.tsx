import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileCheck, 
  FileText, 
  Library, 
  GraduationCap,
  Settings,
  HelpCircle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth < 768);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/lesson-planner', icon: <BookOpen size={20} />, label: 'Lesson Planner' },
    { to: '/assessment-creator', icon: <FileCheck size={20} />, label: 'Assessments' },
    { to: '/materials-generator', icon: <FileText size={20} />, label: 'Materials' },
    { to: '/resource-library', icon: <Library size={20} />, label: 'Resources' },
    { to: '/professional-development', icon: <GraduationCap size={20} />, label: 'Development' },
  ];

  return (
    <>
      <div className={`md:hidden fixed top-4 left-4 z-30 ${isCollapsed ? 'block' : 'hidden'}`}>
        <button 
          onClick={toggleSidebar}
          className="bg-blue-600 text-white p-2 rounded-md shadow-md"
        >
          <Menu size={20} />
        </button>
      </div>
      
      <aside 
        className={`fixed md:relative z-20 bg-white shadow-md h-screen transition-all duration-300 ${
          isCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 rounded-md">
                <Sparkles size={20} />
              </div>
              {!isCollapsed && <span className="font-bold text-lg text-gray-800">TeachAssist</span>}
            </div>
            <button onClick={toggleSidebar} className="md:block hidden text-gray-500">
              {isCollapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
            <button onClick={toggleSidebar} className="md:hidden text-gray-500">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${isCollapsed ? 'justify-center' : 'justify-start'}`
                }
              >
                <span className="flex items-center justify-center">{item.icon}</span>
                {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="space-y-1">
              <NavLink
                to="/settings"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Settings size={20} />
                {!isCollapsed && <span className="ml-3">Settings</span>}
              </NavLink>
              <NavLink
                to="/help"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                <HelpCircle size={20} />
                {!isCollapsed && <span className="ml-3">Help & Support</span>}
              </NavLink>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;