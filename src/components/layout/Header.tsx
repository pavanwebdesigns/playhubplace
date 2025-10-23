import React, { useState } from 'react';
import Logo from '../ui/Logo';
// Use NavLink instead of Link for active styling
import { Link, NavLink } from 'react-router-dom';

interface HeaderProps {
  onSearch?: (query: string) => void;
  className?: string;
}

// --- SVG Icons (Unchanged) ---
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
const GameIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a16.5 16.5 0 0 0-1.636-7.028M15.59 14.37a16.5 16.5 0 0 1 1.636 7.028m-5.84-7.38a16.5 16.5 0 0 0-7.028 1.636M12 1.834v4.82A6 6 0 0 1 15.59 14.37m-3.59 7.38v-4.82a6 6 0 0 1-5.84-7.38m5.84 2.56a16.5 16.5 0 0 1-1.636-7.028M12 1.834a16.5 16.5 0 0 0-7.028 1.636" />
  </svg>
);
const ToolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17 7.37 11.12a2.652 2.652 0 0 1 0-3.75L11.12 3.62c.98-.98 2.69-.98 3.67 0L17.25 6m-5.83 9.17-5.83 5.83a2.652 2.652 0 0 1-3.75 0L.62 17.25c-.98-.98-.98-2.69 0-3.67l5.83-5.83M11.42 15.17A2.652 2.652 0 0 0 11.42 15.17Z" />
  </svg>
);
const BlogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
  </svg>
);
// --- End SVG Icons ---


const Header: React.FC<HeaderProps> = ({
  onSearch,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value); 
  };

  const menuItems = [
    { name: 'Games', path: '/', icon: <GameIcon /> },
    { name: 'Tools', path: '/tools', icon: <ToolsIcon /> },
    { name: 'Blog', path: '/blog', icon: <BlogIcon /> },
  ];

  // --- MODIFIED: Base classes without a color ---
  const navLinkBaseClasses = "hover:text-white transition-colors jersey-font text-lg";

  return (
    <header className={`py-8 px-8 ${className} sticky top-0 z-50 bg-primary-dark/95 backdrop-blur-md shadow-lg`}> 
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
        
        {/* --- MODIFIED: Desktop Navigation --- */}
        <nav className="hidden md:flex flex-shrink-0 items-center gap-6">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'} // Keep this, it's correct
              // --- THIS IS THE FIX ---
              // Explicitly choose the color based on `isActive`
              className={({ isActive }) =>
                `${navLinkBaseClasses} ${isActive ? 'text-blue-400' : 'text-gray-300'}`
              }
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </span>
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
        {/* --- MODIFIED: Mobile Navigation --- */}
        <nav className="flex flex-col items-center gap-6 py-8">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'} // Keep this, it's correct
              // --- THIS IS THE FIX ---
              // Explicitly choose the color based on `isActive`
              className={({ isActive }) =>
                `${navLinkBaseClasses} ${isActive ? 'text-blue-400' : 'text-gray-300'}`
              }
              onClick={() => setIsMobileMenuOpen(false)} 
            >
              <span className="flex items-center gap-2">
                {item.icon}
                {item.name}
              </span>
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