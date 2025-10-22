import React from 'react';
import playLogo from '../../assets/playLogo.svg';

interface LogoProps {
  variant?: 'header' | 'footer';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  variant = 'header',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-2">
        <img 
          src={playLogo} 
          alt="Play Logo" 
          className={`${sizeClasses[size]} ${variant === 'header' ? 'filter ' : ''}`}
        />
       
      </div>
      
    </div>
  );
};

export default Logo;
