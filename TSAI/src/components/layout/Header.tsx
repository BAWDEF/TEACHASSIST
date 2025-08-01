import React, { useState, useEffect } from 'react';
import { Bell, Search, HelpCircle, User } from 'lucide-react';

type HeaderProps = {
  pageTitle: string;
};

const Header: React.FC<HeaderProps> = ({ pageTitle }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-gray-50'
      }`}
    >
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
        
        <div className="hidden md:flex items-center bg-white rounded-lg border border-gray-200 px-3 py-1.5 w-72">
          <Search size={18} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="Search resources, lessons..." 
            className="bg-transparent border-none outline-none flex-1 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Search size={20} className="text-gray-600 md:hidden" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <HelpCircle size={20} className="text-gray-600" />
          </button>
          <button className="ml-2 flex items-center gap-2 rounded-full bg-white border border-gray-200 py-1 pl-1 pr-3 hover:shadow-sm transition-all">
            <div className="bg-blue-100 rounded-full p-1">
              <User size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium hidden md:inline">Ms. Johnson</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;