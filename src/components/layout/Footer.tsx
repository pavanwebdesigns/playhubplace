import React from 'react';
import playFooter from '../../assets/playFooter.svg';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({
  className = '',
}) => {
  return (
    <footer className={`py-8 px-8 text-center ${className}`}>
      <div className="flex justify-center mb-4">
        <img 
          src={playFooter} 
          alt="Play Footer Logo" 
          className="w-96 h-80 object-contain"
        />
      </div>
      <p className="text-gray-400 text-lg jersey-font">
        @ 2025 all rights reserved
      </p>
    </footer>
  );
};

export default Footer;
