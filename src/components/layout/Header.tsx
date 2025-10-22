import React, { useState } from 'react';
import Logo from '../ui/Logo';
// Use NavLink instead of Link for active styling
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  className?: string;
}

// --- Add SVG Icons ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
// --- End SVG Icons ---


const Header: React.FC<HeaderProps> = ({
  onSearch,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  // This function correctly calls onSearch on every key press
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value); // This triggers the search in GameHub.tsx
  };

  // Define menu items
  const menuItems = [
    { name: 'Games', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: 'Blog', path: '/blog' },
  ];

  // Common NavLink classes
  const navLinkClasses = "text-gray-300 hover:text-white transition-colors jersey-font text-lg";
  const activeNavLinkClasses = "text-blue-400"; // Active link style

  return (
    <header className={`py-8 px-8 ${className} relative z-20`}> 
      <div className="container-fluid mx-auto flex items-center justify-between">
        
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link to="/">
            <Logo variant="header" size="lg" />
          </Link>
        </div>
        
        {/* Search bar in the center */}
        <div className="hidden md:flex flex-1 max-w-md mx-12">
          <form onSubmit={handleSearch} className="header-search w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search all games..."
              className="w-full px-6 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 jersey-font text-center"
            />
          </form>
        </div>
        
        {/* --- Desktop Navigation (Right side) --- */}
        <nav className="hidden md:flex flex-shrink-0 items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* --- Mobile Menu Button (Right side) --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

      </div>

      {/* --- Mobile Menu (Overlay) --- */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-primary-dark/95 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
        style={{
          visibility: isMobileMenuOpen ? 'visible' : 'hidden', 
        }}
      >
        <nav className="flex flex-col items-center gap-6 py-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`
              }
              onClick={() => setIsMobileMenuOpen(false)} 
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* --- Search bar in Mobile Menu --- */}
        <div className="flex-1 max-w-md mx-8 mb-8">
          <form onSubmit={handleSearch} className="header-search">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search all games..."
              className="w-full px-6 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 jersey-font text-center"
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;