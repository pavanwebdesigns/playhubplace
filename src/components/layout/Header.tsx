import React, { useState } from 'react';
import Logo from '../ui/Logo';
import { Link } from 'react-router-dom';
import GameHub from '../../pages/GameHub';

interface HeaderProps {
  onSearch?: (query: string) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <header className={`py-8 px-8 ${className}`}>
      <div className="container-fluid mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <Link to="/">
            <Logo variant="header" size="lg" />
          </Link>
        </div>
        
        {/* Search bar in the center */}
        <div className="flex-1 max-w-md mx-12">
          <form onSubmit={handleSearch} className="header-search">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search"
              className="w-full px-6 py-2 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 jersey-font text-center"
            />
          </form>
        </div>
        
        {/* Empty space on the right for balance */}
        <div className="flex-shrink-0 w-32">
          
        </div>
      </div>
    </header>
  );
};

export default Header;
